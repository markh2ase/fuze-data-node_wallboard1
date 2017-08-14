# fuze-data-node_wallboard1
Simple wallboard app in node.js that queries the /calls API and displays some basic stats

1.1 Sample Wallboard – Getting setup

1. Download the source code

2. Unpackage zip file

3. Download and install Docker CE for Mac or Windows from https://www.docker.com/community-edition . More information can be found at  https://docs.docker.com/

4.  Once you have Docker installed, start the application. If you have trouble getting it installed, more information can be found here https://docs.docker.com/get-started/part2/

5. Open a terminal window and verify Docker is working properly by using the command “Docker run hello-world”

6. Now that you have verified that Docker is working correctly, navigate to the working directory where you unpackaged the zip files in step 2 by using the change directory commands.

7. Once you’re in the correct directory, run the build.sh file by using the command “./build.sh”

8.  Once you’ve done that, verify that the image is available by using the command “Docker image”

9.  If the image is present, verify that container is running by using the command “Docker ps”

10. By default, the build script launches that application on localhost 49160. You can now view the wallboard in your browser at localhost:49160


1.2 Sample Wallboard – Teardown

1. To close everything down use the “docker ps” command to see all running containers. Use the docker stop [CONTAINER ID] container to stop the running fuze/node-web-app container

2. Quit the Docker Application
