== README

This repo is starter for Ruby on Rails.

Things you may want to cover:

* Ruby version **2.2.2**

* Rails version **4.2.4**

* Gems
  ```ruby
  gem 'rails', '4.2.4'
  gem 'pg'
  gem 'sass-rails', '~> 5.0'
  gem 'uglifier', '>= 1.3.0'
  gem 'coffee-rails', '~> 4.1.0'
  gem 'jquery-rails'
  gem 'bower-rails'
  gem 'slim-rails'
  gem 'simple_form'
  gem 'carrierwave'
  gem 'devise'
  gem 'mini_magick'
  gem 'friendly_id', '~> 5.1.0'
  gem 'kaminari'
  gem 'turbolinks'
  gem 'jquery-turbolinks'
  gem 'nprogress-rails'
  gem 'bootstrap-sass', '~> 3.3.5'

  # gem 'therubyracer', platforms: :ruby

  group :development, :test do
    gem 'pry-rails'
    gem 'rspec-rails', '~> 3.0'
    gem 'faker'
  end

  group :test do
    gem "factory_girl_rails", "~> 4.0"
    gem 'database_cleaner'
    gem 'simplecov', :require => false
  end

  group :development do
    gem 'web-console', '~> 2.0'
    gem 'spring'
  end

  ```
* Initialize starter
  ```
    git clone git@github.com:dimasjt/starter.git YourAppName
    cd YourAppName
    bundle install
  ```

* Database using **postgresql**

* Database initialization
  Create database.yml in config/database.yml
  
  ```yaml
    default: &default
      adapter: postgresql
      encoding: unicode
      username: postgres
      password: postgres
      host: localhost
      pool: 5
    
    development:
      <<: *default
      database: name_db_development 
    
    test:
      <<: *default
      database: name_db_test
    
    production:
      adapter: postgresql
      encoding: unicode
      database: name_db_production
      username: postgres
      password: <%= ENV['BOTTLE_DATABASE_PASSWORD'] %>

  ```

  ```
    rake db:create
    rake db:create RAILS_ENV=test
  ```

* How to run the test suite
  ```
    rspec
  ```
