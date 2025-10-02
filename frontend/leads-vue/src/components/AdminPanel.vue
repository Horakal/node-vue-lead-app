<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { DataTableHeader } from 'vuetify'
import apiClient from '@/api/api'
interface LeadDto {
  id: string
  name: string
  email: string
  phone: string
  jobTitle: string
  birthDate: string
  message: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
  fbclid?: string
  createdAt: string
}

export default defineComponent({
  name: 'AdminPanel',
  setup() {
    const router = useRouter()
    const leads = ref<LeadDto[]>([])
    const searchQuery = ref('')
    const snackbar = ref(false)
    const timeout = ref(3000)
    const text = ref('')
    const color = ref('red')

    const headers: DataTableHeader[] = [
      { title: 'Nome', key: 'name', width: '40%' },
      { title: 'E-mail', key: 'email', width: '40%' },
      { title: 'Ações', key: 'actions', sortable: false, width: '20%' },
    ]

    const fetchLeads = async () => {
      await apiClient
        .get('/api/leads')
        .then((response) => {
          leads.value = response.data
        })
        .catch(() => {
          snackbar.value = true
          text.value = 'Erro ao carregar leads'
        })
    }

    const filteredLeads = computed(() => {
      const query = searchQuery.value.toLowerCase()
      if (leads.value.length === 0) return []
      return leads.value.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) || lead.email.toLowerCase().includes(query),
      )
    })

    const deleteLead = async (id: string) => {
      if (confirm('Confirmar exclusão?')) {
        await apiClient
          .delete(`/api/leads/${id}`)
          .then(() => {
            leads.value = leads.value.filter((lead) => lead.id !== id)
            snackbar.value = true
            text.value = 'Lead excluído com sucesso!'
            color.value = 'green'
          })
          .catch(() => {
            snackbar.value = true
            text.value = 'Erro ao excluir lead'
          })
      }
    }

    const exportToCSV = () => {
      const headers = [
        'ID,Nome,E-mail,Telefone,Cargo,Data de Nascimento,Mensagem,UTM Source,Created At',
      ]
      const rows = leads.value.map((lead) =>
        [
          lead.id,
          lead.name,
          lead.email,
          lead.phone,
          lead.jobTitle,
          lead.birthDate,
          lead.message,
          lead.utmSource || '',
          lead.createdAt,
        ]
          .map((field) => `"${field}"`)
          .join(','),
      )
      const csv = [...headers, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'leads.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    }

    const logout = async () => {
      try {
        await apiClient.post('/api/logout', {}, { withCredentials: true })
        router.push('/login')
      } catch {
        alert('Erro ao fazer logout')
      }
    }

    fetchLeads()

    return {
      leads,
      searchQuery,
      headers,
      filteredLeads,
      deleteLead,
      exportToCSV,
      logout,
      snackbar,
      timeout,
      text,
      color,
    }
  },
})
</script>

<template>
  <v-container fluid class="mx-auto" style="max-width: 1200px; padding: 0px !important">
    <v-card elevation="2">
      <v-card-title class="text-h5">Painel Administrativo</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="searchQuery"
              label="Buscar por nome ou e-mail"
              prepend-inner-icon="mdi-magnify"
              filled
              clearable
              class="py-2"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="text-right">
            <v-btn color="success" large @click="exportToCSV" class="mb-4">Exportar para CSV</v-btn>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="filteredLeads"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-tooltip text="Ver detalhes" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-eye"
                  color="primary"
                  density="compact"
                  v-bind="props"
                  :to="{ name: 'LeadDetails', params: { id: item.id } }"
                ></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Excluir" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-delete"
                  color="red"
                  class="ma-1"
                  density="compact"
                  v-bind="props"
                  @click="deleteLead(item.id)"
                ></v-btn>
              </template>
            </v-tooltip>
          </template>
        </v-data-table>
        <v-btn color="error" large @click="logout" class="mt-4">Sair</v-btn>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="color">
      {{ text }}

      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
