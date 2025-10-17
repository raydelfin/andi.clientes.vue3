import { ref } from 'vue'
function checkInitialAuth() {
    const usuario = localStorage.getItem('usuario')
    return !(usuario === null || usuario === '' || usuario === 'null')
}
export const isAuthenticatedRef = ref(checkInitialAuth())
export function updateAuthStatus(isLoggedIn: boolean) {
    isAuthenticatedRef.value = isLoggedIn
}