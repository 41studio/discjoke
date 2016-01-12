Rails.application.routes.draw do
  root 'pages#index'
  get "/bossdj", to: 'pages#bossdj'

  namespace :api do
    resources :channels, only: [:create, :index, :update] do
      collection do
        put 'remove/:id', to: 'channels#remove'
        get 'show/:url', to: 'channels#show'
        get 'sign_in/:url', to: 'channels#sign_in'
        get 'get_page_count', to: 'channels#get_page_count'
      end
    end
    resources :videos do
      collection do
        get :play
        put 'play/:id', to: 'videos#played', as: :played
        get 'get_page_count/:channel_url/videos', to: 'videos#get_page_count'
      end
    end
  end

  get "*path", to: 'pages#index'
end
