
SET Version=%1
CALL npm run build
CALL docker build -t harbor.qgil.net/shipagent/ship-front-prod:%Version% .
CALL docker push harbor.qgil.net/shipagent/ship-front-prod:%Version%
CALL docker tag harbor.qgil.net/shipagent/ship-front-prod:%Version% harbor.qgil.net/shipagent/ship-front-prod:latest
CALL docker push harbor.qgil.net/shipagent/ship-front-prod:latest