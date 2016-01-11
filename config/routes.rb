Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    resources :channels, only: [:create, :index, :update] do
      collection do
        put 'remove/:id', to: 'channels#remove'
        get 'show/:url', to: 'channels#show'
      end
    end
    resources :videos do
      collection do
        get :play
        put 'play/:id', to: 'videos#played', as: :played
      end
    end
  end

  get "*path", to: 'pages#index'
end
