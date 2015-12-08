Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    resources :videos do
      collection do
        get :play
        put 'play/:id', to: 'videos#played', as: :played
      end
    end
  end

  get "*path", to: 'pages#index'
end
