# micro-services-z-library

Zlibrary is a SaaS system meant for libraries to administrate their book offering.  
By being able to manage their stock, see their active bookings in real-time, and invite users to join the organization,  
it's a useful tool to keep control over the overall operations of the org.

Users are allowed to join via invitation and search for books they are interested in. They can book, and after returning the book  
they are allowed to leave reviews and rate the title.

Project done using:

- Microservices architecture
- Multitenancy (users can belong to different libraries)
- Node.js for most microservices, API Gateway, and SDK
- npm for SDK publishing
- React js for frontend
- .NET core for the Review Service
- Docker containers for easier deployment
- MySQL databases in each microservice
- AWS suite for deployment (EC2 instances, S3 for FE, Cloudwatch for monitoring)
- New Relic for analytics
- nginx as a load balancer
- Unit tests with Jest
- CI pipeline with Github Actions

## Main Challenges
- Proper separation of concerns between services
- Data consistency in cases when one service was down
- Centralized Authentication & De-centralized Authorization (via role-checking with JWTs)
- API key for SDK usage
- SDK versioning, documentation and publishing
- 12 Factor compliance

## Evidence
<img width="1200" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/218a7341-b6e7-46da-83e4-f9046b73361b">
<img width="1199" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/c47f8c4e-9ec9-439b-85c3-6d6ae58e1eff">
<img width="1196" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/0381d45a-eca5-4d43-9116-747bcbbdee38">
<img width="400" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/30255222-43f3-4306-8c8a-3628aacd2569">  
</br><img width="285" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/6e6f489f-4a6f-4e49-8d8a-4c3e76d31bfc">  

## Architecture
<img width="300" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/8ef8aaf1-ace1-4183-b639-3041877395da">  

<img width="300" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/fc67645a-afc7-4e79-b14e-074ca16f9fc3">

<img width="300" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/b95c89e9-9590-4988-b14e-771b9bbdb54e">

<img width="300" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/b46dba48-4471-428a-a41b-07527c0153d1">

<img width="300" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/1c415a59-449a-4e8d-b08f-f611055b247f">

<img width="300" alt="image" src="https://github.com/santitopo/micro-services-z-library/assets/43559181/85cf51c2-ac81-4a91-bb92-c39bc81b889f">



Submitted during the course Software Architecture in Practice
[Demo (Spanish version)](https://www.youtube.com/watch?v=D5xyhjq49uI)
