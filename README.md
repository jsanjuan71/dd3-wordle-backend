# dd3-wordle-backend
The wordle app api services

## Getting started
1. Clone project
    ```
    git clone https://github.com/jsanjuan71/dd3-wordle-backend.git
    ```

2. Enter in the project folder
    ```
    cd dd3-wordle-backend
    ```
3. Install dependancies
    ```
    npm install
    ```
4. Configure your environment variables on the env file
    > .env

    Note: You can copy ''.env.example'' and rename it to ''.env'' and modify its content to your desired values

5. finally launch the API server for the next escenarios:
    * Development, if you are going to put the hands on code
        ```
        npm run dev
        ```
    * Testing, if you want to evaluate the quality of your code
        ```
        npx ts-jest config:init 
        npm run test
        ```
    * Deployment, if you want to prepare for deploy on stage environment
        ```
        npm run build
        ```