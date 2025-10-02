<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/api'
interface LoginForm {
  email: string
  password: string
}

export default defineComponent({
  name: 'UserLogin',
  setup() {
    const router = useRouter()
    const form = reactive<LoginForm>({ email: '', password: '' })
    const snackbar = ref(false)
    const timeout = ref(3000)
    const text = ref('')
    const color = ref('red')

    const login = async () => {
      try {
        await apiClient.post('api/auth/login', form)
        router.push('/admin')
      } catch {
        snackbar.value = true
        text.value = 'Erro ao fazer login'
      }
    }

    return { form, login, snackbar, timeout, text, color }
  },
})
</script>

<template>
  <v-container fluid class="mx-auto" style="max-width: 800px">
    <v-card elevation="2" class="pa-4">
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                label="E-mail"
                type="email"
                filled
                :rules="[(v) => !!v || 'E-mail é obrigatório']"
                required
                class="py-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                label="Senha"
                type="password"
                filled
                :rules="[(v) => !!v || 'Senha é obrigatória']"
                required
                class="py-2"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn type="submit" color="primary" large>Entrar</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-snackbar v-model="snackbar" :timeout="timeout" :color="color">
        {{ text }}

        <template v-slot:actions>
          <v-btn color="blue" variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </v-container>
</template>
