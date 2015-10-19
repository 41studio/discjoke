== README

This repo is starter for Ruby on Rails.

Things you may want to cover:

* Ruby version 2.2.2

* Rails version 4.2.4

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

* Database using **postgresql**

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions