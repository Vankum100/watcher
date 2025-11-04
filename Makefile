migrate:
	docker-compose run --rm app npm run migrate

seed:
	docker-compose run --rm app npm run seed

setup:
	docker-compose run --rm app npm run setup

up:
	docker-compose up --build

down:
	docker-compose down

logs:
	docker-compose logs -f
