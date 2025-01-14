# Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

module Gql::Types::KnowledgeBase
  class LocaleType < Gql::Types::BaseObject
    include Gql::Concerns::IsModelObject

    description 'Knowledge Base Locale'

    field :primary, Boolean, null: false

    belongs_to :knowledge_base, Gql::Types::KnowledgeBaseType, null: false
    belongs_to :system_locale, Gql::Types::LocaleType, null: false
  end
end
