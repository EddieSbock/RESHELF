import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Esporta_contesto } from './contesto/AuthContext'
import Navbar from './componenti/Navbar'
import Home from './pagine/Home'
import Login from './pagine/Login'
import Registrazione from './pagine/Registrazione'
import ModificaPost from './pagine/ModificaPost'
import VisualizzaPost from './pagine/VisualizzaPost'
import Profilo from './pagine/Profilo'
import { Footer } from './componenti/Footer'
import { ProtezioneRotte } from './utility/ProtezioneRotte'
import { ElencoRichieste } from './pagine/ElencoRichieste'
import './App.css'

function App() {
  return (
    <Esporta_contesto>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrazione" element={<Registrazione />} />
          <Route path="/post/:id" element={<VisualizzaPost />} />

          <Route element={<ProtezioneRotte />}>
            <Route path="/profile" element={<Profilo />} />
          </Route>

          <Route element={<ProtezioneRotte ruoloRichiesto="admin" />}>
            <Route path="/modifica-post" element={<ModificaPost />} />
            <Route path="/modifica-post/:id" element={<ModificaPost />} />
            <Route path="/ElencoRichieste" element={<ElencoRichieste />} />
          </Route>
        </Routes>

        <Footer />
      </Router>
    </Esporta_contesto>
  )
}

export default App
