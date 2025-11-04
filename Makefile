migrate:
	docker-compose run --rm app npm run migrate

up:
	docker-compose up

down:
	docker-compose down -v

test:
	docker-compose run --rm app npm test
