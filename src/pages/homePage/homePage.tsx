import { useEffect, type MouseEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle } from '../../firebase'
import { useGoogleLogin } from '../../hooks/contexts'
import GoogleSignInButton from '../../components/googleSignInButton/googleSignInButton'
import paths from '../../routing/paths'
import styles from './homePage.module.css'

const HomePage = () => {
  const { user, authLoading } = useGoogleLogin()
  const navigate = useNavigate()

  const onClickLoginButton: MouseEventHandler = (e) => {
    e.preventDefault()

    signInWithGoogle().catch((e: Error) => {
      if (import.meta.env.DEV) {
        console.error(`Error ${e.name}: ${e.message}`)
      }
    })
  }

  useEffect(() => {
    if (user) void navigate(paths.dashboard.main)
  }, [user])

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <h1 className={styles.header}>Skyrim Inventory Management</h1>
        <div className={styles.login}>
          <GoogleSignInButton
            onClick={onClickLoginButton}
            loading={authLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage
