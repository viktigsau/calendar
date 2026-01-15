class StrictDict(dict):
    def __init__(self, *args, type_map: dict | None=None, **kwargs):
        # Let dict do its normal initialization
        super().__init__(*args, **kwargs)

        # Now run your custom checks
        self.type_map = type_map
        if isinstance(self.type_map, dict):
            for key, value in self.items():
                if key not in self.type_map.keys():
                    raise ValueError("invalid data for StrictDict")
                if isinstance(value, dict):
                    value = StrictDict(value, type_map=self.type_map[key])
                    continue
                if not isinstance(value, self.type_map[key]):
                    raise TypeError("invalid data for StrictDict")

def load_conf(file:str="conf/server.conf", default_path:str="conf/default-server.conf"):
    with open(default_path) as default:
        config = default.read().split("\n")

    with open(file) as conf:
        config += conf.read().split("\n")

    out: dict[str, str | int | float | bool] = {}

    for line in config:
        line = line.strip()

        if not line or line.startswith("#"):
            continue

        try:
            key, value = line.split("=")
        except ValueError:
            raise ValueError(f"invalid config line: {line if line.strip() else "empty"}")

        try:
            out[key] = int(value)
        except ValueError:
            try:
                out[key] = float(value)
            except ValueError:
                if value == "true":
                    out[key] = True
                elif value == "false":
                    out[key] = False
                else:
                    out[key] = value
    return out