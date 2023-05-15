# Change YAML/JSON naming convention

![ChangeNamingConventionTitle](https://github.com/ShipitSmarter/vscode-change-naming-convention/assets/7061710/6a656fcb-e3b8-4545-8f1c-fcf25ea9cbf7)
![ChangeNamingConventionExplorer](https://github.com/ShipitSmarter/vscode-change-naming-convention/assets/7061710/b626827f-ac22-4bb0-84ed-e978f4adae50)


This extension enables the quick modification of the naming convention of property keys in YAML or JSON files.

## Features

There are 5 new command pallete shortcuts:"

* `Convert to PascalCase`
* `Convert to camelCase`
* `Convert to snake_case`
* `Convert to kebab-case`
* `Convert to CONSTANT_CASE`

These commands will iterate over every object in the JSON or YAML file and modify the keys to fit the selected case

## Settings

There is one configuration option. This can be defined in `change-naming-convention` in vscode settings (`.vscode/settings.json`).


```json
{
    "change-naming-convention": {
        "ignoreRegex": ["[A-Z_]*", ".*[0-9]"]
    }
}
```

| id             | description                                                                                                                                                                   | type     | default   | example                  |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-----------|--------------------------|
| `ignoreRegex`  | Provide regular expressions for property names that should be ignored during case changing, note: start and end of string notation `^{REGEX}$`, will be added automatically   | string[] | `[]`      | `["[A-Z_]*", ".*[0-9]"]` |


---

## Release Notes

### 0.0.6

* Cleaned up the context menu formatting
* Added configuration option to provide regular expressions for ignoring certain keys.

### 0.0.4

Updated the name to include YAML and JSON tags

### 0.0.3

Initial release, supporting PascalCase, camelCase, snake_case, kebab-case, CONSTANT_CASE
