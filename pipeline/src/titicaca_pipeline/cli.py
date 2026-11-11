import argparse
import json
from pathlib import Path
import sys
from titicaca_pipeline.boundaries import process_ana_shapefile
from titicaca_pipeline.download import (
    MissingCredentialsError,
    DownloadError,
    download_granule,
    get_granule_filename,
    get_subset_filename,
    EarthdataSession,
    get_earthdata_credentials
)
from titicaca_pipeline.imerg import (
    precompute_basin_weights,
    read_imerg_precipitation_grid,
    aggregate_basin_precipitation
)
from titicaca_pipeline.trends import compute_all_basin_trends
from titicaca_pipeline.contrasts import compute_all_contrasts_and_evidence
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
                creds = get_earthdata_credentials()
                s = EarthdataSession()
                s.headers.update({"User-Agent": "TiticacaContrast/1.0"})
                if creds["type"] == "token":
                    s.headers.update({"Authorization": f"Bearer {creds['token']}"})
                else:
                    s.auth = (creds["username"], creds["password"])
                for m in range(1, 13):
                    p = download_granule(args.year, m, cache_dir, session=s)
                    print(f"Mes {args.year}-{m:02d} descargado: {p.name}")
                return 0
            if getattr(args, "all", False):
                print("Descarga completa 2001-2025 (300 meses)...")
                creds = get_earthdata_credentials()
                s = EarthdataSession()
                s.headers.update({"User-Agent": "TiticacaContrast/1.0"})
                if creds["type"] == "token":
                    s.headers.update({"Authorization": f"Bearer {creds['token']}"})
                else:
                    s.auth = (creds["username"], creds["password"])
                downloaded_count = 0
                for y in range(2001, 2026):
                    for m in range(1, 13):
                        p = download_granule(y, m, cache_dir, session=s)
                        downloaded_count += 1
                        if downloaded_count % 12 == 0 or downloaded_count == 300:
                            print(f"Progreso: {downloaded_count}/300 meses ({y}-{m:02d})")
                print(f"Descarga completa finalizada: {downloaded_count} meses disponibles en cache.")
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
            pilot_hdf5 = cache_dir / get_granule_filename(2020, 1)
            pilot_sub = cache_dir / get_subset_filename(2020, 1)
            target = pilot_sub if pilot_sub.exists() else pilot_hdf5
            if not target.exists():
                print("Error: No se encontro archivo del mes piloto en cache. Ejecute download-imerg --pilot primero.")
                return 1
            grid, meta = read_imerg_precipitation_grid(target)
            print(f"Mes piloto 2020-01 cargado ({target.name}). Unidades: {meta['units']}. Dimensiones: {meta['shape']}")
            for b_id in ["ramis", "coata", "ilave", "huancane"]:
                precip_mm, frac = aggregate_basin_precipitation(
                    grid, weights[b_id], 2020, 1,
                    lon_offset=meta["lon_offset"], lat_offset=meta["lat_offset"]
                )
                print(f"  {b_id}: {precip_mm:.2f} mm (cobertura valida: {frac*100:.1f}%)")
            return 0

        if getattr(args, "all", False):
            monthly_records = []
            files_by_date = {}
            for p in cache_dir.glob("3B-MO.MS.MRG.3IMERG.*"):
                if p.suffix in [".HDF5", ".nc4"]:
                    parts = p.name.split(".")
                    date_str = parts[4].split("-")[0]
                    y = int(date_str[:4])
                    m = int(date_str[4:6])
                    if (y, m) not in files_by_date or p.name.endswith(".subset.nc4"):
                        files_by_date[(y, m)] = p

            expected_dates = [(y, m) for y in range(2001, 2026) for m in range(1, 13)]
            print(f"Procesando {len(expected_dates)} meses (2001-2025)...")

            for y, m in expected_dates:
                f_path = files_by_date.get((y, m))
                if f_path and f_path.exists():
                    grid, meta = read_imerg_precipitation_grid(f_path)
                    for b_id in ["ramis", "coata", "ilave", "huancane"]:
                        precip_mm, frac = aggregate_basin_precipitation(
                            grid, weights[b_id], y, m,
                            lon_offset=meta["lon_offset"], lat_offset=meta["lat_offset"]
                        )
                        monthly_records.append({
                            "basin_id": b_id,
                            "year": y,
                            "month": m,
                            "precip_mm": precip_mm,
                            "valid_area_fraction": frac,
                            "source_dataset": "GPM_3IMERGM",
                            "source_version": "07"
                        })
                else:
                    for b_id in ["ramis", "coata", "ilave", "huancane"]:
                        monthly_records.append({
                            "basin_id": b_id,
                            "year": y,
                            "month": m,
                            "precip_mm": None,
                            "valid_area_fraction": 0.0,
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
                    total_mm = float(sum(item["precip_mm"] for item in records if item["precip_mm"] is not None))
                    annual_records.append({
                        "year": int(year),
                        "basin_id": basin_id,
                        "annual_precip_mm": round(total_mm, 2),
                        "complete_months": 12,
                        "valid_year": True,
                        "source_version": "07"
                    })
                else:
                    annual_records.append({
                        "year": int(year),
                        "basin_id": basin_id,
                        "annual_precip_mm": None,
                        "complete_months": int(complete_months),
                        "valid_year": False,
                        "source_version": "07"
                    })

            annual_records.sort(key=lambda x: (x["year"], x["basin_id"]))
            out_annual = Path("web/public/data/precipitation-annual.json")
            export_annual_json(annual_records, out_annual)
            print(f"JSON anual exportado: {out_annual} ({len(annual_records)} registros)")
            return 0

    if args.command == "analyze":
        annual_path = Path("web/public/data/precipitation-annual.json")
        if not annual_path.exists():
            print("Error: No se encontro precipitation-annual.json. Ejecute extract --all primero.")
            return 1
        with open(annual_path, "r", encoding="utf-8") as f:
            annual_records = json.load(f)

        trends_data = compute_all_basin_trends(annual_records)
        contrasts_data, evidence_data = compute_all_contrasts_and_evidence(annual_records)

        out_trends = Path("web/public/data/trends.json")
        out_contrasts = Path("web/public/data/contrasts.json")
        out_evidence = Path("web/public/data/evidence.json")

        export_json(trends_data, out_trends)
        export_json(contrasts_data, out_contrasts)
        export_json(evidence_data, out_evidence)

        print(f"Tendencias individuales calculadas: {out_trends} ({len(trends_data)} cuencas)")
        for t in trends_data:
            print(f"  {t['basin_id']}: {t['sen_slope_mm_per_year']:+.2f} mm/año (p={t['mann_kendall_p']:.4f}, {t['trend_direction']})")

        print(f"Contrastes emparejados calculados: {out_contrasts} ({len(contrasts_data)} parejas)")
        for c in contrasts_data:
            print(f"  {c['basin_a']} vs {c['basin_b']}: {c['gap_slope_mm_per_year']:+.2f} mm/año (p={c['p_value']:.4f}, q={c['q_value_fdr']:.4f}) -> {c['evidence_status']}")

        print(f"Fichas de evidencia exportadas: {out_evidence} ({len(evidence_data)} fichas)")

        manifest_path = Path("web/public/data/manifest.json")
        if manifest_path.exists():
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            data_dir = Path("web/public/data")
            for fname in ["basins.geojson", "basins.json", "precipitation-monthly.csv", "precipitation-annual.json", "trends.json", "contrasts.json", "evidence.json"]:
                f_p = data_dir / fname
                if f_p.exists():
                    manifest["integrity"][fname] = compute_file_sha256(f_p)
            manifest["notes"] = "Fases 1, 2 y 3 completadas: Cuencas ANA oficiales, series NASA IMERG V07 2001-2024, tendencias individuales y detector de contrastes con errores robustos HAC y control FDR calculados."
            export_json(manifest, manifest_path)
            print("Manifiesto actualizado con hashes de integridad.")
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
