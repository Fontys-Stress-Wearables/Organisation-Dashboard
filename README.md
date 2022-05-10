# Organization dashboard

## Introduction
The organization dashboard is used by organization admins to manage patients and patient groups.

## Build Steps
In order for the organization dashboard to function the following services need to be running:

- Patient Service
- Patient Group Service
- Organization Service

### Development
To run the project locally you can run `npm start`.
This will start a dev server on port 3000. 

### Production
To get the project running in kubernetes there are a couple of steps:
- build the image for the backend by running `docker build -t <HOST>/organization-dashboard:<TAG> .`.
- Push the image to the docker registry by running `docker push <HOST>/organization-dashboard:<TAG>`.
- add the service and the database to kubernetes by running `kubectl apply -f frontend.yaml`. 

Alternatively you can execute these steps by running the `deploy.sh` script. You can set the host and tag by passing the "h" and "t" flags. For example `./deploy.sh -t latest -h localhost:5001`.
If you just want to update the kubernetes configuration you can run `./deploy.sh -s`. 
The `-s` option skips the docker build steps.