import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Model from './components/Model';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';

const App = () => {
 
  return (
   <main className="bg-black">
    <Navbar></Navbar>
    <Hero></Hero>
    <Highlights></Highlights>
    <Model></Model>
    <Features></Features>
    <HowItWorks></HowItWorks>
    </main>
  )
}

export default App
