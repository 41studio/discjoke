Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    resources :channels, only: [:create, :index, :update] do
      put 'remove/:id', to: 'channels#remove', on: :collection
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
