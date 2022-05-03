# Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

require 'rails_helper'

# Login and logout work only via controller, so use type: request.
RSpec.describe Gql::Mutations::Login, type: :request do

  # Temporary Hack: skip tests if ENABLE_EXPERIMENTAL_MOBILE_FRONTEND is not set.
  # TODO: Remove when this switch is not needed any more.
  around do |example|
    example.run if ENV['ENABLE_EXPERIMENTAL_MOBILE_FRONTEND'] == 'true'
  end

  context 'when logging on' do
    let(:agent_password) { 'some_test_password' }
    let(:agent) { create(:agent, password: agent_password) }
    let(:query) do
      File.read(Rails.root.join('app/frontend/common/graphql/mutations/login.graphql')) +
        File.read(Rails.root.join('app/frontend/common/graphql/fragments/errors.graphql'))
    end
    let(:password) { agent_password }
    let(:fingerprint) { Faker::Number.number(digits: 6).to_s }
    let(:variables) do
      {
        login:       agent.login,
        password:    password,
        fingerprint: fingerprint,
      }
    end
    let(:graphql_response) do
      post '/graphql', params: { query: query, variables: variables }, as: :json
      json_response
    end

    context 'with correct credentials' do
      it 'returns session data' do
        expect(graphql_response['data']['login']['sessionId']).to be_present
      end
    end

    context 'without CSRF token', allow_forgery_protection: true do
      it 'fails with error message' do
        expect(graphql_response['errors'][0]).to include('message' => 'CSRF token verification failed!')
      end

      it 'fails with error type' do
        expect(graphql_response['errors'][0]['extensions']).to include({ 'type' => 'Exceptions::NotAuthorized' })
      end
    end

    context 'with wrong password' do
      let(:password) { 'wrong' }

      it 'fails with error message' do
        expect(graphql_response['data']['login']['errors']).to eq([{
                                                                    'message' => 'Login failed. Have you double-checked your credentials and completed the email verification step?',
                                                                    'field'   => nil
                                                                  }])
      end
    end

    context 'without fingerprint' do
      let(:fingerprint) { nil }

      it 'fails with error message' do
        expect(graphql_response['errors'][0]).to include('message' => 'Variable $fingerprint of type String! was provided invalid value')
      end

      # No error type available for GraphQL::ExecutionErrors.
    end
  end
end