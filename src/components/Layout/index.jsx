import React, { useLayoutEffect } from "react"
import { ThemeProvider } from "styled-components"

import { useDispatch, useSelector } from "react-redux"
import { setDark, setLight } from "reducers/theme"

import { dark, light } from "assets/theme"

import GlobalStyles from "components/GlobalStyles"

import Header from "./Header"
import Body from "./Body"
import Footer from "./Footer"

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const { theme } = useSelector(state => state.theme)

  let isSystemDarkMode = null
  if (typeof window !== "undefined") {
    isSystemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  let localTheme = null
  if (typeof localStorage !== "undefined") {
    localTheme = localStorage.getItem("theme")
  }

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    dispatch(nextTheme === "dark" ? setDark : setLight)
    localStorage.setItem("theme", nextTheme)
  }

  useLayoutEffect(() => {
    if (isSystemDarkMode && !localTheme)
      dispatch(isSystemDarkMode ? setDark : setLight)
    else if (localTheme) dispatch(localTheme === "dark" ? setDark : setLight)
  }, [])

  return (
    <ThemeProvider theme={theme === "light" ? light : dark}>
      <GlobalStyles />
      <Header toggleTheme={toggleTheme} />
      <Body>{children}</Body>
      <Footer />
    </ThemeProvider>
  )
}

export default Layout
