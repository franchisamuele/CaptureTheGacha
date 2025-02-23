# gacha-world

Catching gacha for fun

## Usage

### Set up Environment

Rename `.env.example` to `.env` in the root folder and in the frontend folder and change the values as needed.

### Create HTTPS certificates & JWT Secrets

Create self-signed certificates + private and public key for JWT:

```bash
./init.sh
```

### Build the application

```bash
docker compose up -d --build
```

### Access the endpoints

Install npm dependencies:

```bash
cd frontend
npm install
cd -
```

Run the frontend:

```bash
cd frontend
npm start
```

Open the browser and navigate to https://localhost:3000

## Testing

### Unit Tests

Prepare the environment:

```bash
npm install -g newman
```

Auth service:

```bash
cd tests
./auth_unit_test.sh
cd -
```

Player service:

```bash
cd tests
./player_unit_test.sh
cd -
```

Auction service:

```bash
cd tests
./auction_unit_test.sh
cd -
```

### Integration Testing (ATTENTION: This will remove all data in the volumes)

Auth service:

```bash
cd tests
./auth_integration_test.sh
cd -
```

Player service:

```bash
cd tests
./player_integration_test.sh
cd -
```

Auction service:

```bash
cd tests
./auction_integration_test.sh
cd -
```

### Security Testing

Run `bandit` and `pip-audit` using `docker-compose`:

```bash
# TODO
```
