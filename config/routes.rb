Rails.application.routes.draw do
  root 'pages#index'
  get "/bossdj", to: 'pages#bossdj'
  get "oauth2callback", to: 'accounts#oauth'

  namespace :api, defaults: { format: :json } do
    resources :channels do
      resources :videos, only: :create

      post "sign_in", on: :member
    end

    resources :videos, except: :create do
      member do
        get :play
        post :next
        post :prev
      end
    end
  end

  get "*path", to: 'pages#index'
end
