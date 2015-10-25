# Rails 4.2.4 Starter Kit

## Detail Starter Kit

* Ruby version **2.2.2**
* Rails version **4.2.4**
* Testing With RSpec version **3.3.2**
* Database using **PostgreSQL**
 

## Initialize Starter Kit

* Clone repository
 ```
  git clone git@github.com:dimasjt/starter.git YourAppName
  cd YourAppName
  bundle install
```

* Rename **Starter** to **YourAppName**
  application.rb
  ```ruby
    module YourAppName
      class Application < Rails::Application
      #...other code
  ```
  application.html.slim
  ```slim
    head
      title YourAppName
      /... other code
  ```
  
* Rename *database.yml.example* to *database.yml*, and change username, password and database name.

* Run migration
  ```
    rake db:create
    rake db:migrate
  ```
