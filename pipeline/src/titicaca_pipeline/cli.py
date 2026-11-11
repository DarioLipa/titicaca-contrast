import argparse
import json
from pathlib import Path
import sys
from titicaca_pipeline.boundaries import process_ana_shapefile
from titicaca_pipeline.download import (
    MissingCredentialsError,
    DownloadError,
    download_granule,
    get_granule_filename
)
from titicaca_pipeline.imerg import (
    precompute_basin_weights,
    read_imerg_precipitation_grid,
    aggregate_basin_precipitation
)
from titicaca_pipeline.export import (
    export_monthly_csv,
    export_annual_json,
    export_json
)
from titicaca_pipeline.provenance import compute_file_sha256

def main() -> int:
    parser = argparse.ArgumentParser(prog="titicaca-cli")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("validate-boundaries")

    download_parser = subparsers.add_parser("download-imerg")
    download_parser.add_argument("--pilot", action="store_true")
    download_parser.add_argument("--all", action="store_true")
    download_parser.add_argument("--year", type=int)
    download_parser.add_argument("--month", type=int)

    extract_parser = subparsers.add_parser("extract")
    extract_parser.add_argument("--pilot", action="store_true")
    extract_parser.add_argument("--all", action="store_true")

    subparsers.add_parser("analyze")
    subparsers.add_parser("export")
    subparsers.add_parser("verify")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        return 1

    if args.command == "validate-boundaries":
        zip_path = Path("pipeline/data/raw/UnidadesHidrograficas.zip")
        if not zip_path.exists():
            print(f"Error: No se encontro el archivo oficial {zip_path}")
            return 1
        h = compute_file_sha256(zip_path)
        out_public = Path("web/public/data")
        out_interim = Path("pipeline/data/interim")
        res = process_ana_shapefile(zip_path, out_public, out_interim, h)
        print(f"Exito: {res['count']} cuencas procesadas y exportadas.")
        print(f"GeoJSON web: {res['web_geojson']}")
        print(f"JSON web: {res['web_json']}")
        return 0

    if args.command == "download-imerg":
        cache_dir = Path("pipeline/data/raw/imerg")
        try:
            if args.pilot:
                print("Descargando mes piloto: 2020-01...")
                p = download_granule(2020, 1, cache_dir)
                print(f"Mes piloto descargado exitosamente: {p}")
                return 0
            if args.year and args.month:
                p = download_granule(args.year, args.month, cache_dir)
                print(f"Granulo descargado: {p}")
                return 0
            if args.year:
                for m in range(1, 13):
                    p = download_granule(args.year, m, cache_dir)
                    print(f"Mes {m:02d} descargado: {p.name}")
                return 0
            if getattr(args, "all", False):
                print("Descarga completa 2001-2025...")
                for y in range(2001, 2026):
                    for m in range(1, 13):
                        download_granule(y, m, cache_dir)
                        print(f"{y}-{m:02d} descargado")
                return 0
            print("Debe especificar --pilot, --all o --year [--month]")
            return 1
        except MissingCredentialsError as e:
            print(f"Bloqueo por credenciales: {e}")
            return 2
        except DownloadError as e:
            print(f"Fallo de descarga: {e}")
            return 3

    if args.command == "extract":
        basins_path = Path("pipeline/data/interim/basins_exact.geojson")
        if not basins_path.exists():
            print("Error: No se encontro basins_exact.geojson. Ejecute validate-boundaries primero.")
            return 1
        weights = precompute_basin_weights(basins_path)
        cache_dir = Path("pipeline/data/raw/imerg")

        if args.pilot:
            pilot_file = cache_dir / get_granule_filename(2020, 1)
            if not pilot_file.exists():
                print(f"Error: No se encontro el archivo del mes piloto {pilot_file.name}. Ejecute download-imerg --pilot primero.")
                return 1
            grid, meta = read_imerg_precipitation_grid(pilot_file)
            print(f"Mes piloto 2020-01 cargado. Unidades: {meta['units']}. Dimensiones: {meta['shape']}")
            for b_id in ["ramis", "coata", "ilave", "huancane"]:
                precip_mm, frac = aggregate_basin_precipitation(grid, weights[b_id], 2020, 1)
                print(f"  {b_id}: {precip_mm:.2f} mm (cobertura valida: {frac*100:.1f}%)")
            return 0

        if getattr(args, "all", False):
            monthly_records = []
            available_files = sorted(list(cache_dir.glob("3B-MO.MS.MRG.3IMERG.*.HDF5")))
            if not available_files:
                print("No se encontraron granulos descargados en pipeline/data/raw/imerg/")
                return 1

            for f_path in available_files:
                parts = f_path.name.split(".")
                date_str = parts[4].split("-")[0]
                y = int(date_str[:4])
                m = int(date_str[4:6])
                grid, _ = read_imerg_precipitation_grid(f_path)
                for b_id in ["ramis", "coata", "ilave", "huancane"]:
                    precip_mm, frac = aggregate_basin_precipitation(grid, weights[b_id], y, m)
                    monthly_records.append({
                        "basin_id": b_id,
                        "year": y,
                        "month": m,
                        "precip_mm": precip_mm,
                        "valid_area_fraction": frac,
                        "source_dataset": "GPM_3IMERGM",
                        "source_version": "07"
                    })

            out_csv = Path("web/public/data/precipitation-monthly.csv")
            export_monthly_csv(monthly_records, out_csv)
            print(f"CSV mensual exportado: {out_csv} ({len(monthly_records)} filas)")

            by_basin_year = {}
            for r in monthly_records:
                k = (r["basin_id"], r["year"])
                if k not in by_basin_year:
                    by_basin_year[k] = []
                by_basin_year[k].append(r)

            annual_records = []
            for (basin_id, year), records in by_basin_year.items():
                complete_months = sum(1 for item in records if item["precip_mm"] is not None)
                if complete_months == 12:
                    total_mm = sum(item["precip_mm"] for item in records if item["precip_mm"] is not None)
                    annual_records.append({
                        "year": year,
                        "basin_id": basin_id,
                        "annual_precip_mm": round(total_mm, 2),
                        "complete_months": 12,
                        "valid_year": True,
                        "source_version": "07"
                    })
                else:
                    annual_records.append({
                        "year": year,
                        "basin_id": basin_id,
                        "annual_precip_mm": None,
                        "complete_months": complete_months,
                        "valid_year": False,
                        "source_version": "07"
                    })

            annual_records.sort(key=lambda x: (x["year"], x["basin_id"]))
            out_annual = Path("web/public/data/precipitation-annual.json")
            export_annual_json(annual_records, out_annual)
            print(f"JSON anual exportado: {out_annual} ({len(annual_records)} registros)")
            return 0

    if args.command == "verify":
        csv_path = Path("web/public/data/precipitation-monthly.csv")
        annual_path = Path("web/public/data/precipitation-annual.json")
        manifest_path = Path("web/public/data/manifest.json")
        print("Verificando integridad de datos...")
        print(f"  Monthly CSV exists: {csv_path.exists()}")
        print(f"  Annual JSON exists: {annual_path.exists()}")
        print(f"  Manifest exists: {manifest_path.exists()}")
        return 0

    print(f"Comando {args.command} reconocido.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
