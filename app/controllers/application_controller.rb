class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_user_id

  protected
    def current_user_id
      session[:user_id]
    end

  private
    def set_user_id
      session[:user_id] ||= SecureRandom.hex(16)
    end

    def save_and_response_to(status, model)
      if status
        render json: model, status: :ok
      elsif model.present? && (model.class.to_s.eql?('Channel') || model.class.to_s.eql?('Video'))
        render json: { errors: model.errors.full_messages }, status: 400
      else
        render json: model
      end
    end
end
