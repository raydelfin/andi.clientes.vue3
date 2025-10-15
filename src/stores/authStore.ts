import { ref } from 'vue'
function checkInitialAuth() {
    let usuario = localStorage.getItem('usuario')
    return !(usuario === null || usuario === '' || usuario === 'null')
}
export const isAuthenticatedRef = ref(checkInitialAuth())
export function updateAuthStatus(isLoggedIn: boolean) {
    isAuthenticatedRef.value = isLoggedIn
    console.log('isAuthenticatedRef.value ---')
    console.log(isAuthenticatedRef.value)
}