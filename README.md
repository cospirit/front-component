![CoSpirit](doc/logo.png)

# CoSpirit `front-component` [![CircleCI](https://circleci.com/gh/cospirit/front-component.svg?style=shield&circle-token=10ffb22301f55ca80520d483e9a32111ca545333)](https://circleci.com/gh/cospirit/front-component)

## Development

### Project install

    git clone git@github.com:cospirit/front-component.git
    cd front-component
    make development@install

### Get a shell in containers

    make development@sh

## Tests

### Lints and fixes files

    make development@lint

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Install in a project

Add the dependency in `package.json` file. Be careful to choose de version corresponding to your needs.

```json
{  
  ...  
  "dependencies": {
    ...
    "front-component": "git://github.com/cospirit/front-component.git#v1.0.0"
  },  
  ...  
}  
```
Then update dependencies:

    npm install front-component
