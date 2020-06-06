import PrismRust from "./rust";
import PrismToml from "./toml";
import PrismWasm from "./wasm";
import PrismMakefile from "./makefile";
import PrismDocker from "./docker";

export function loadLanguages(Prism: any) {
  PrismRust(Prism);
  PrismToml(Prism);
  PrismWasm(Prism);
  PrismMakefile(Prism);
  PrismDocker(Prism);
}
