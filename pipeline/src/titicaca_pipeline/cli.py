import argparse
import sys
from pathlib import Path

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

    print(f"Comando {args.command} reconocido.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
