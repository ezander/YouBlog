Keeping track of an application is not a simple task. Over the last decade, user expectations from software vendors have kept growing, alongside the growth in cloud solutions, applications, and the simplicity of their onboarding processes. If a software provider does not meet an organization’s functionality, quality, performance, and user experience requirements, R&D can very easily explore other providers and replace their existing software with another.

This also applies to the relatively new security and compliance standards, which are a substantial aspect of any software. As these standards toughen, software organizations must keep up with the latest threats, provide both infrastructure and applicative solutions, and improve their levels of service, availability, and transparency. If they don’t, their reputations will suffer—and they’ll lose customers.

In this article, we will cover the multiple ways in which logs and metrics can help your organization maintain a high level of service, improve efficiency, and meet business goals.

## Functionality and Performance: Maintaining High Service Levels

On Amazon Prime Day in 2018, Amazon’s website completely crashed. It simply wasn’t ready for such a large load of users, and most customers weren’t able to complete their purchases. Amazon estimated the loss to be almost 1 billion dollars, and their reputation suffered. Understandably, eBay, AliExpress, and other retail platforms were the big winners of the day—and of the following Black Friday and Cyber Monday shopping days.

The quality of a company’s service—encapsulating software functionality and performance, user experience, and more—determines how successful a business is. And in order to achieve a level of service high enough to attract new customers while retaining existing ones, many types of software testing and monitoring should be conducted and applied. Both frontend and backend components need to be verified, and each component type has its own metrics and approval levels. 

## Logs to the Rescue

Logs are one of the basic tools that developers, QA, and DevOps need to master. Application logs are the primary source of information on code behavior, system and infrastructure logs, database logs, web-server logs, and other component logs like Kubernetes or RabbitMQ. They can help R&D make educated and informed decisions about the application by providing information about its actions and the user experience. They can also help with the root-cause analysis process and are the best place to write and save applicative events. Almost everything can be written in an application log, from application events to components’ states to executed SQL queries or results—and, of course, debugging information and errors. 

Together with application logs, all the other log types (system, infrastructure, database, web server, and more) provide a view of the software’s functionality within the current infrastructure and scale. This helps developers and DevOps prepare a suitable solution and environment for the application. Collecting these logs can be very simple via a fluentd agent or by instrumenting the code to send the logs directly to the log management system (like ELK or graylog).  

## Metrics: The Next Level

Still, logs are not enough. Being event driven, logs only give a narrow viewpoint of the relevant component and can’t provide a wider picture across all system components or over a longer period of time. But metrics can.

Metrics supplement logs by broadening the view, looking at the application’s functionality and performance over time as well as during multiple events. Metrics can help determine how much load the component is under and if scaling is needed to handle it. They can also define the type of hosting and infrastructure required by the specific component or application as a whole.

Basic metrics include the host or container CPU usage, memory utilization, and storage capacity. These metrics give a broad understanding of the infrastructure’s status and how well it suits the application’s requirements. However, APM metrics, such as slowest requests, highest throughput, most time-consuming requests, and even the Apdex score, provide a deeper understanding. Using these types of metrics, collected and visualized by NewRelic, Nagios, or many other tools, helps R&D to focus on use cases that have performance problems and plan how to address them. 

## Using Nginx? Even Better

Being one of the most commonly used web servers, nginx constantly improves and provides new abilities for its users. It has both the web server aspect where it serves content to users and can also function as a load balancer for all requests sent to the application APIs.

While setting up a new application that needs to expose content to the internet as well as receive and process requests, R&D must take into consideration all product requirements and provide a solution that answers all of these requirements. Nginx, which can easily run on any server type or on a docker container, gives developers the ability to receive and redirect requests from a user interface to the right API, can behave as a reverse proxy, and can also control the traffic into and from the application.

## Nginx Logs

Nginx manages a set of logs that help developers with understanding the status of traffic and behaviors in the system.

The nginx web-server access log, which by default can be found in /var/log/nginx/access.log on most Linux distributions, logs every client request the server processes. By default, the access log is globally enabled inside the main nginx configuration file, located at /etc/nginx/nginx.conf. In this config file, users can define the domain name, log path, and the log format, so it can be more readable when required. The nginx error log, storing different types of applicative and general errors, supplements the access log and helps to assemble a broad status of the production environment as well as provide a complete audit of all the events. These logs can be found in /var/log/nginx/error.log. The same config file also provides configuration for the error log. In this config file, users can define the log level for the error log and control the level of detail the file will have for every event.

When building an application and using nginx as the web server, these logs (together with other nginx logs) help developers with understanding whether the setup was done correctly and seeing the request flow in and out of the system, which also gives perspective on error rate and the load the system is under. 

## Security and Compliance: Creating Trust And Clarity 

One of the most important aspects of any modern application, especially cloud-based applications, is security. When external providers (not R&D) manage most, if not all, of the infrastructure, organizations can be exposed to security threats that are not always under R&D’s control. Ensuring security in this situation requires detailed information about every request and activity in the application, from its creation on the client side to the web server and backend services. 
Logs + Metrics

The ability to backtrace a user request is absolutely imperative for compliance, and knowing the origin of the request is essential for security and auditing. Logging is the only way to retrieve this information, which is stored in application logs containing every request made in the application. The information must be constantly reviewed in order to identify suspicious activity or misuse of services. Sophisticated attackers can change logs to hide their activity, but, in general, logs are the one source of truth for all application activity.

Application live metrics add to this by providing a broader view of application security. They can help identify attacks as they occur, allowing developers and security engineers to come up with a solution for attacks and prevent them from becoming too serious.

Regarding auditing and compliance, organizations have to save all customer activity data in case they’re requested to share it with customers or regulatory authorities. This is only possible by logging the activity at the component level.

## Auditing and Analysis: Respond to and Improve User Experience

Information logs can provide application owners and designers with data about user experience. Analyzing flows in the system helps engineers understand how users interact with the application, how long it takes the browser to render and display a given page, when each user leaves that page, and how changes in the application affect the user.

This information, together with metrics about customer business usage and the conversion from visitors to customers, can help application designers decide on the way the UI should behave and how the backend can support this behavior to allow scaling and work under stress.

Client-side and server-side logs should be correlated and consolidated to obtain a clear picture of the user experience, which will later be used to understand required changes in the application logic and infrastructure. A common and useful system to perform this correlation and consolidation process is the ELK stack. ELK allows parsing, transforming, and buffering data from all services, applicative and infrastructure, that report to it.

## Conclusion 

The reasons for logging and keeping track of application metrics vary from functional to auditing. Logs and metrics simplify developers’ day-to-day work on root-cause analysis processes, shorten response times during security incidents, and provide valuable information to both system architects and product designers.

This information helps team members make informed decisions about all aspects of the application—from hosting and scaling solutions to how the product should function and respond to users. Logs and metrics are an added value that no organization can ignore, and they should be a top priority for R&D.
