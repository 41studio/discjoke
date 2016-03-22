# Discjoke

Create playlist for playing loved videos from youtube

## Discjoke Technologies

* [Ruby](https://www.ruby-lang.org/) version **2.3.0**
* [Ruby on Rails](http://rubyonrails.org/) version **4.2.6**
* [AngularJS](https://angularjs.org/) version **1.5.2**
* [PostgreSQL](http://www.postgresql.org/)
* [Bootstrap](http://getbootstrap.com)
* [Slim Ruby Template](https://github.com/slim-template/slim-rails)
* [Pubnub](https://www.pubnub.com/)

## Installation to local computer

* Clone discjoke to your local machine
```bash
$ git clone git@github.com:41studio/discjoke.git
```
* Rename database config in **config/database.yml.example** to **database.yml** and change config username, password and database name.
* Then bundle install
```bash
$ bundle install
```
* Create database
```bash
$ rake db:create
```
* Run migration
```bash
$ rake db:migrate
```
* Run the server
```bash
$ rails server
```
