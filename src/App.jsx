import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Model from './components/Model';
import Features from './components/Features';

const App = () => {
 
  return (
   <main className="bg-black">
    <Navbar></Navbar>
    <Hero></Hero>
    <Highlights></Highlights>
    <Model></Model>
    <Features></Features>
    </main>
  )
}

export default App
