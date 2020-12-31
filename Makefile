.SILENT:

USER_ID=`id -u`
GROUP_ID=`id -g`

# 1. filter main receipe name from args (https://stackoverflow.com/a/47008498)
# 2. exclude 'development@install' in remaining args for receipe chaining
# 3. exclude 'development@update' in remaining args for receipe chaining
# TODO find a better way to manage this exception
ifneq "$(or $(filter development@install,$(MAKECMDGOALS)), $(filter development@update,$(MAKECMDGOALS)))" ""
	args := `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`
	args := $(subst development@install,,$(args))
	args := $(subst development@update,,$(args))
else
	args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`
endif

# this target avoid make to return an error of unknown target when an extra argument is passed
# https://stackoverflow.com/a/47008498
%:
	:

##############################
###      Developpment      ###
##############################

development@install: development@env development@git-hooks.install development@assets.install development@assets.watch
development@update:  development@down development@assets.install development@assets.watch

development@git-hooks.install:
	if [ ! -d "/tmp/dev-stack" ]; then \
		mkdir -p /tmp/dev-stack && cd /tmp/dev-stack && \
		git init -q && \
		git remote add origin git@github.com:cospirit/dev-stack.git && \
		git config core.sparseCheckout true && \
		echo "git-hooks/" >> .git/info/sparse-checkout; \
	fi
	cd /tmp/dev-stack && git pull -q origin master
	cp /tmp/dev-stack/git-hooks/* .git/hooks/;

development@env:
	echo "\n###> Docker ###\nUSER_ID=$(USER_ID)\nGROUP_ID=$(GROUP_ID)\n###< Docker ###" > system.env

### Development - NPM ###

development@assets.install:
	docker-compose run --rm app npm install

development@assets.build:
	docker-compose run --rm app npm run build

development@assets.watch:
	docker-compose run --rm app npm run serve

development@lint:
	docker-compose run --rm app npm run lint

### Development Docker ###

development@sh:
	docker-compose run --rm app bash

development@down:
	docker-compose down --remove-orphans

development@state:
	docker-compose ps

##############################
###          Test          ###
##############################

test@assets.build:
	npm run build

test@lint:
	npm run lint
