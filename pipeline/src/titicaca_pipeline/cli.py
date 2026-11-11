import argparse
from pathlib import Path
import sys
from titicaca_pipeline.boundaries import process_ana_shapefile
from titicaca_pipeline.provenance import compute_file_sha256

def main() -> int:
    parser = argparse.ArgumentParser(prog="titicaca-cli")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("validate-boundaries")
    subparsers.add_parser("download-imerg")
    subparsers.add_parser("extract")
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

    print(f"Comando {args.command} reconocido.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
