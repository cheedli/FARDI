import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Game from './pages/Game.jsx'
import Results from './pages/Results.jsx'
import Phase2Intro from './pages/Phase2Intro.jsx'
import Phase2Step from './pages/Phase2Step.jsx'
import Phase2Complete from './pages/Phase2Complete.jsx'
import Phase2Remedial from './pages/Phase2Remedial.jsx'
import Phase2StepResults from './pages/Phase2StepResults.jsx'

// Phase 3 Step 1 imports - organized in folder
import Phase3Step1Intro from './pages/Phase3/Step1/index.jsx'
import Phase3Step1Interaction1 from './pages/Phase3/Step1/Interaction1.jsx'
import Phase3Step1Interaction2 from './pages/Phase3/Step1/Interaction2.jsx'
import Phase3Step1Interaction3 from './pages/Phase3/Step1/Interaction3.jsx'
import Phase3Step1ScoreCalculation from './pages/Phase3/Step1/ScoreCalculation.jsx'

// Phase 3 Step 1 Remedial imports (only A1 has Task B)
import Phase3Step1RemedialA1TaskA from './pages/Phase3/Step1/RemedialA1/TaskA.jsx'
import Phase3Step1RemedialA1TaskB from './pages/Phase3/Step1/RemedialA1/TaskB.jsx'
import Phase3Step1RemedialA2TaskA from './pages/Phase3/Step1/RemedialA2/TaskA.jsx'
import Phase3Step1RemedialA2TaskB from './pages/Phase3/Step1/RemedialA2/TaskB.jsx'
import Phase3Step1RemedialA2TaskC from './pages/Phase3/Step1/RemedialA2/TaskC.jsx'
import Phase3Step1RemedialA2TaskD from './pages/Phase3/Step1/RemedialA2/TaskD.jsx'
import Phase3Step1RemedialB1TaskA from './pages/Phase3/Step1/RemedialB1/TaskA.jsx'
import Phase3Step1RemedialB2TaskA from './pages/Phase3/Step1/RemedialB2/TaskA.jsx'
import Phase3Step1RemedialC1TaskA from './pages/Phase3/Step1/RemedialC1/TaskA.jsx'

// Phase 3 Step 2 imports - organized in folder
import Phase3Step2Intro from './pages/Phase3/Step2/index.jsx'
import Phase3Step2Interaction1 from './pages/Phase3/Step2/Interaction1.jsx'
import Phase3Step2Interaction2 from './pages/Phase3/Step2/Interaction2.jsx'
import Phase3Step2Interaction3 from './pages/Phase3/Step2/Interaction3.jsx'
import Phase3Step2ScoreCalculation from './pages/Phase3/Step2/ScoreCalculation.jsx'

// Phase 3 Step 2 Remedial imports
import Phase3Step2RemedialA1TaskA from './pages/Phase3/Step2/RemedialA1/TaskA.jsx'
import Phase3Step2RemedialA2TaskA from './pages/Phase3/Step2/RemedialA2/TaskA.jsx'
import Phase3Step2RemedialB1TaskA from './pages/Phase3/Step2/RemedialB1/TaskA.jsx'
import Phase3Step2RemedialB2TaskA from './pages/Phase3/Step2/RemedialB2/TaskA.jsx'
import Phase3Step2RemedialC1TaskA from './pages/Phase3/Step2/RemedialC1/TaskA.jsx'

// Phase 3 Step 3 imports - organized in folder
import Phase3Step3Intro from './pages/Phase3/Step3/index.jsx'
import Phase3Step3Interaction1 from './pages/Phase3/Step3/Interaction1.jsx'
import Phase3Step3Interaction2 from './pages/Phase3/Step3/Interaction2.jsx'
import Phase3Step3Interaction3 from './pages/Phase3/Step3/Interaction3.jsx'
import Phase3Step3ScoreCalculation from './pages/Phase3/Step3/ScoreCalculation.jsx'

// Phase 3 Step 3 Remedial imports
import Phase3Step3RemedialA1TaskA from './pages/Phase3/Step3/RemedialA1/TaskA.jsx'
import Phase3Step3RemedialA2TaskA from './pages/Phase3/Step3/RemedialA2/TaskA.jsx'
import Phase3Step3RemedialB1TaskA from './pages/Phase3/Step3/RemedialB1/TaskA.jsx'
import Phase3Step3RemedialB2TaskA from './pages/Phase3/Step3/RemedialB2/TaskA.jsx'
import Phase3Step3RemedialC1TaskA from './pages/Phase3/Step3/RemedialC1/TaskA.jsx'

// Phase 3 Step 4 imports - organized in folder
import Phase3Step4Intro from './pages/Phase3/Step4/index.jsx'
import Phase3Step4Interaction1 from './pages/Phase3/Step4/Interaction1.jsx'
import Phase3Step4Interaction2 from './pages/Phase3/Step4/Interaction2.jsx'
import Phase3Step4ScoreCalculation from './pages/Phase3/Step4/ScoreCalculation.jsx'

// Phase 3 Step 4 Remedial imports
import Phase3Step4RemedialA1TaskA from './pages/Phase3/Step4/RemedialA1/TaskA.jsx'
import Phase3Step4RemedialA2TaskA from './pages/Phase3/Step4/RemedialA2/TaskA.jsx'
import Phase3Step4RemedialB1TaskA from './pages/Phase3/Step4/RemedialB1/TaskA.jsx'
import Phase3Step4RemedialB2TaskA from './pages/Phase3/Step4/RemedialB2/TaskA.jsx'
import Phase3Step4RemedialC1TaskA from './pages/Phase3/Step4/RemedialC1/TaskA.jsx'

import Phase4Complete from './pages/Phase4Complete.jsx'
import Phase5Complete from './pages/Phase5Complete.jsx'
import PhaseJourney from './pages/PhaseJourney.jsx'
// Phase 4 Step 1 imports - organized in folder
import Phase4Step1Intro from './pages/Phase4Step1/index.jsx'
import Phase4Step1Interaction1 from './pages/Phase4Step1/Interaction1.jsx'
import Phase4Step1Interaction2 from './pages/Phase4Step1/Interaction2.jsx'
import Phase4Step1Interaction3 from './pages/Phase4Step1/Interaction3.jsx'

// Phase 4 Step 3 imports - organized in folder
import Phase4Step3Intro from './pages/Phase4Step3/index.jsx'
import Phase4Step3VocabularyWarmup from './pages/Phase4Step3/VocabularyWarmup.jsx'
import Phase4Step3Interaction1 from './pages/Phase4Step3/Interaction1.jsx'
import Phase4Step3Interaction2 from './pages/Phase4Step3/Interaction2.jsx'
import Phase4Step3Interaction3 from './pages/Phase4Step3/Interaction3.jsx'

// Phase 4 Step 4 imports - organized in folder
import Phase4Step4Intro from './pages/Phase4Step4/index.jsx'
import Phase4Step4Interaction1 from './pages/Phase4Step4/Interaction1.jsx'
import Phase4Step4Interaction2 from './pages/Phase4Step4/Interaction2.jsx'
import Phase4Step4Interaction3 from './pages/Phase4Step4/Interaction3.jsx'

// Phase 4 Step 5 imports - organized in folder
import Phase4Step5Intro from './pages/Phase4Step5/Intro.jsx'
import Phase4Step5Interaction1 from './pages/Phase4Step5/Interaction1.jsx'
import Phase4Step5Interaction2 from './pages/Phase4Step5/Interaction2.jsx'
import Phase4Step5Interaction3 from './pages/Phase4Step5/Interaction3.jsx'

// Phase 4.2 Step 1 imports - Social Media Marketing
import Phase4_2Step1Intro from './pages/Phase4Step2/Step1/index.jsx'
import Phase4_2Step1Interaction1 from './pages/Phase4Step2/Step1/Interaction1.jsx'
import Phase4_2Step1Interaction2 from './pages/Phase4Step2/Step1/Interaction2.jsx'
import Phase4_2Step1Interaction3 from './pages/Phase4Step2/Step1/Interaction3.jsx'

// Phase 4.2 Step 2 imports - Social Media Marketing
import Phase4_2Step2Intro from './pages/Phase4Step2/Step2/index.jsx'
import Phase4_2Step2Interaction1 from './pages/Phase4Step2/Step2/Interaction1.jsx'
import Phase4_2Step2Interaction2 from './pages/Phase4Step2/Step2/Interaction2.jsx'
import Phase4_2Step2Interaction3 from './pages/Phase4Step2/Step2/Interaction3.jsx'

// Phase 4.2 Step 3 imports - Social Media Marketing
import Phase4_2Step3Intro from './pages/Phase4Step2/Step3/index.jsx'
import Phase4_2Step3Interaction1 from './pages/Phase4Step2/Step3/Interaction1.jsx'
import Phase4_2Step3Interaction2 from './pages/Phase4Step2/Step3/Interaction2.jsx'
import Phase4_2Step3Interaction3 from './pages/Phase4Step2/Step3/Interaction3.jsx'

// Phase 4.2 Step 4 imports - Social Media Marketing
import Phase4_2Step4Intro from './pages/Phase4Step2/Step4/index.jsx'
import Phase4_2Step4Interaction1 from './pages/Phase4Step2/Step4/Interaction1.jsx'
import Phase4_2Step4Interaction2 from './pages/Phase4Step2/Step4/Interaction2.jsx'
import Phase4_2Step4Interaction3 from './pages/Phase4Step2/Step4/Interaction3.jsx'

// Phase 4.2 Step 5 imports - Error Correction & Evaluation
import Phase4_2Step5Intro from './pages/Phase4Step2/Step5/index.jsx'
import Phase4_2Step5Interaction1 from './pages/Phase4Step2/Step5/Interaction1.jsx'
import Phase4_2Step5Interaction2 from './pages/Phase4Step2/Step5/Interaction2.jsx'
import Phase4_2Step5Interaction3 from './pages/Phase4Step2/Step5/Interaction3.jsx'

// Phase 4.2 Step 1 Remedial A1 imports
import Phase4_2Step1RemedialA1TaskA from './pages/Phase4Step2/Step1/RemedialA1/TaskA.jsx'
import Phase4_2Step1RemedialA1TaskB from './pages/Phase4Step2/Step1/RemedialA1/TaskB.jsx'
import Phase4_2Step1RemedialA1TaskC from './pages/Phase4Step2/Step1/RemedialA1/TaskC.jsx'
import Phase4_2Step1RemedialA1Results from './pages/Phase4Step2/Step1/RemedialA1/Results.jsx'

// Phase 4.2 Step 1 Remedial A2 imports
import Phase4_2Step1RemedialA2TaskA from './pages/Phase4Step2/Step1/RemedialA2/TaskA.jsx'
import Phase4_2Step1RemedialA2TaskB from './pages/Phase4Step2/Step1/RemedialA2/TaskB.jsx'
import Phase4_2Step1RemedialA2TaskC from './pages/Phase4Step2/Step1/RemedialA2/TaskC.jsx'
import Phase4_2Step1RemedialA2Results from './pages/Phase4Step2/Step1/RemedialA2/Results.jsx'

// Phase 4.2 Step 1 Remedial B1 imports
import Phase4_2Step1RemedialB1TaskA from './pages/Phase4Step2/Step1/RemedialB1/TaskA.jsx'
import Phase4_2Step1RemedialB1TaskB from './pages/Phase4Step2/Step1/RemedialB1/TaskB.jsx'
import Phase4_2Step1RemedialB1TaskC from './pages/Phase4Step2/Step1/RemedialB1/TaskC.jsx'
import Phase4_2Step1RemedialB1TaskD from './pages/Phase4Step2/Step1/RemedialB1/TaskD.jsx'
import Phase4_2Step1RemedialB1TaskE from './pages/Phase4Step2/Step1/RemedialB1/TaskE.jsx'
import Phase4_2Step1RemedialB1TaskF from './pages/Phase4Step2/Step1/RemedialB1/TaskF.jsx'
import Phase4_2Step1RemedialB1Results from './pages/Phase4Step2/Step1/RemedialB1/Results.jsx'

// Phase 4.2 Step 1 Remedial B2 imports
import Phase4_2Step1RemedialB2TaskA from './pages/Phase4Step2/Step1/RemedialB2/TaskA.jsx'
import Phase4_2Step1RemedialB2TaskB from './pages/Phase4Step2/Step1/RemedialB2/TaskB.jsx'
import Phase4_2Step1RemedialB2TaskC from './pages/Phase4Step2/Step1/RemedialB2/TaskC.jsx'
import Phase4_2Step1RemedialB2TaskD from './pages/Phase4Step2/Step1/RemedialB2/TaskD.jsx'
import Phase4_2Step1RemedialB2TaskE from './pages/Phase4Step2/Step1/RemedialB2/TaskE.jsx'
import Phase4_2Step1RemedialB2TaskF from './pages/Phase4Step2/Step1/RemedialB2/TaskF.jsx'
import Phase4_2Step1RemedialB2Results from './pages/Phase4Step2/Step1/RemedialB2/Results.jsx'

// Phase 4.2 Step 1 Remedial C1 imports
import Phase4_2Step1RemedialC1TaskA from './pages/Phase4Step2/Step1/RemedialC1/TaskA.jsx'
import Phase4_2Step1RemedialC1TaskB from './pages/Phase4Step2/Step1/RemedialC1/TaskB.jsx'
import Phase4_2Step1RemedialC1TaskC from './pages/Phase4Step2/Step1/RemedialC1/TaskC.jsx'
import Phase4_2Step1RemedialC1TaskD from './pages/Phase4Step2/Step1/RemedialC1/TaskD.jsx'
import Phase4_2Step1RemedialC1TaskE from './pages/Phase4Step2/Step1/RemedialC1/TaskE.jsx'
import Phase4_2Step1RemedialC1TaskF from './pages/Phase4Step2/Step1/RemedialC1/TaskF.jsx'
import Phase4_2Step1RemedialC1TaskG from './pages/Phase4Step2/Step1/RemedialC1/TaskG.jsx'
import Phase4_2Step1RemedialC1TaskH from './pages/Phase4Step2/Step1/RemedialC1/TaskH.jsx'
import Phase4_2Step1RemedialC1Results from './pages/Phase4Step2/Step1/RemedialC1/Results.jsx'

// Phase 4.2 Step 2 Remedial A2 imports
import Phase4_2Step2RemedialA2TaskA from './pages/Phase4Step2/Step2/RemedialA2/TaskA.jsx'
import Phase4_2Step2RemedialA2TaskB from './pages/Phase4Step2/Step2/RemedialA2/TaskB.jsx'
import Phase4_2Step2RemedialA2TaskC from './pages/Phase4Step2/Step2/RemedialA2/TaskC.jsx'
import Phase4_2Step2RemedialA2Results from './pages/Phase4Step2/Step2/RemedialA2/Results.jsx'

// Phase 4.2 Step 2 Remedial B1 imports
import Phase4_2Step2RemedialB1TaskA from './pages/Phase4Step2/Step2/RemedialB1/TaskA.jsx'
import Phase4_2Step2RemedialB1TaskB from './pages/Phase4Step2/Step2/RemedialB1/TaskB.jsx'
import Phase4_2Step2RemedialB1TaskC from './pages/Phase4Step2/Step2/RemedialB1/TaskC.jsx'
import Phase4_2Step2RemedialB1Results from './pages/Phase4Step2/Step2/RemedialB1/Results.jsx'

// Phase 4.2 Step 2 Remedial B2 imports
import Phase4_2Step2RemedialB2TaskA from './pages/Phase4Step2/Step2/RemedialB2/TaskA.jsx'
import Phase4_2Step2RemedialB2TaskB from './pages/Phase4Step2/Step2/RemedialB2/TaskB.jsx'
import Phase4_2Step2RemedialB2TaskC from './pages/Phase4Step2/Step2/RemedialB2/TaskC.jsx'
import Phase4_2Step2RemedialB2TaskD from './pages/Phase4Step2/Step2/RemedialB2/TaskD.jsx'
import Phase4_2Step2RemedialB2Results from './pages/Phase4Step2/Step2/RemedialB2/Results.jsx'

// Phase 4.2 Step 2 Remedial C1 imports
import Phase4_2Step2RemedialC1TaskA from './pages/Phase4Step2/Step2/RemedialC1/TaskA.jsx'
import Phase4_2Step2RemedialC1TaskB from './pages/Phase4Step2/Step2/RemedialC1/TaskB.jsx'
import Phase4_2Step2RemedialC1TaskC from './pages/Phase4Step2/Step2/RemedialC1/TaskC.jsx'
import Phase4_2Step2RemedialC1TaskD from './pages/Phase4Step2/Step2/RemedialC1/TaskD.jsx'
import Phase4_2Step2RemedialC1TaskE from './pages/Phase4Step2/Step2/RemedialC1/TaskE.jsx'
import Phase4_2Step2RemedialC1TaskF from './pages/Phase4Step2/Step2/RemedialC1/TaskF.jsx'
import Phase4_2Step2RemedialC1TaskG from './pages/Phase4Step2/Step2/RemedialC1/TaskG.jsx'
import Phase4_2Step2RemedialC1TaskH from './pages/Phase4Step2/Step2/RemedialC1/TaskH.jsx'
import Phase4_2Step2RemedialC1Results from './pages/Phase4Step2/Step2/RemedialC1/Results.jsx'

// Phase 4.2 Step 3 Remedial A2 imports
import Phase4_2Step3RemedialA2TaskA from './pages/Phase4Step2/Step3/RemedialA2/TaskA.jsx'
import Phase4_2Step3RemedialA2TaskB from './pages/Phase4Step2/Step3/RemedialA2/TaskB.jsx'
import Phase4_2Step3RemedialA2TaskC from './pages/Phase4Step2/Step3/RemedialA2/TaskC.jsx'
import Phase4_2Step3RemedialA2Results from './pages/Phase4Step2/Step3/RemedialA2/Results.jsx'

// Phase 4.2 Step 3 Remedial B1 imports
import Phase4_2Step3RemedialB1TaskA from './pages/Phase4Step2/Step3/RemedialB1/TaskA.jsx'
import Phase4_2Step3RemedialB1TaskB from './pages/Phase4Step2/Step3/RemedialB1/TaskB.jsx'
import Phase4_2Step3RemedialB1TaskC from './pages/Phase4Step2/Step3/RemedialB1/TaskC.jsx'
import Phase4_2Step3RemedialB1TaskD from './pages/Phase4Step2/Step3/RemedialB1/TaskD.jsx'
import Phase4_2Step3RemedialB1Results from './pages/Phase4Step2/Step3/RemedialB1/Results.jsx'

// Phase 4.2 Step 3 Remedial B2 imports
import Phase4_2Step3RemedialB2TaskA from './pages/Phase4Step2/Step3/RemedialB2/TaskA.jsx'
import Phase4_2Step3RemedialB2TaskB from './pages/Phase4Step2/Step3/RemedialB2/TaskB.jsx'
import Phase4_2Step3RemedialB2TaskC from './pages/Phase4Step2/Step3/RemedialB2/TaskC.jsx'
import Phase4_2Step3RemedialB2TaskD from './pages/Phase4Step2/Step3/RemedialB2/TaskD.jsx'
import Phase4_2Step3RemedialB2Results from './pages/Phase4Step2/Step3/RemedialB2/Results.jsx'

// Phase 4.2 Step 3 Remedial C1 imports
import Phase4_2Step3RemedialC1TaskA from './pages/Phase4Step2/Step3/RemedialC1/TaskA.jsx'
import Phase4_2Step3RemedialC1TaskB from './pages/Phase4Step2/Step3/RemedialC1/TaskB.jsx'
import Phase4_2Step3RemedialC1TaskC from './pages/Phase4Step2/Step3/RemedialC1/TaskC.jsx'
import Phase4_2Step3RemedialC1TaskD from './pages/Phase4Step2/Step3/RemedialC1/TaskD.jsx'
import Phase4_2Step3RemedialC1TaskE from './pages/Phase4Step2/Step3/RemedialC1/TaskE.jsx'
import Phase4_2Step3RemedialC1TaskF from './pages/Phase4Step2/Step3/RemedialC1/TaskF.jsx'
import Phase4_2Step3RemedialC1TaskG from './pages/Phase4Step2/Step3/RemedialC1/TaskG.jsx'
import Phase4_2Step3RemedialC1TaskH from './pages/Phase4Step2/Step3/RemedialC1/TaskH.jsx'
import Phase4_2Step3RemedialC1Results from './pages/Phase4Step2/Step3/RemedialC1/Results.jsx'

// Phase 4.2 Step 4 Remedial A2 imports
import Phase4_2Step4RemedialA2TaskA from './pages/Phase4Step2/Step4/RemedialA2/TaskA.jsx'
import Phase4_2Step4RemedialA2TaskB from './pages/Phase4Step2/Step4/RemedialA2/TaskB.jsx'
import Phase4_2Step4RemedialA2TaskC from './pages/Phase4Step2/Step4/RemedialA2/TaskC.jsx'
import Phase4_2Step4RemedialA2Results from './pages/Phase4Step2/Step4/RemedialA2/Results.jsx'

// Phase 4.2 Step 4 Remedial B1 imports
import Phase4_2Step4RemedialB1TaskA from './pages/Phase4Step2/Step4/RemedialB1/TaskA.jsx'
import Phase4_2Step4RemedialB1TaskB from './pages/Phase4Step2/Step4/RemedialB1/TaskB.jsx'
import Phase4_2Step4RemedialB1TaskC from './pages/Phase4Step2/Step4/RemedialB1/TaskC.jsx'
import Phase4_2Step4RemedialB1Results from './pages/Phase4Step2/Step4/RemedialB1/Results.jsx'

// Phase 4.2 Step 4 Remedial B2 imports
import Phase4_2Step4RemedialB2TaskA from './pages/Phase4Step2/Step4/RemedialB2/TaskA.jsx'
import Phase4_2Step4RemedialB2TaskB from './pages/Phase4Step2/Step4/RemedialB2/TaskB.jsx'
import Phase4_2Step4RemedialB2TaskC from './pages/Phase4Step2/Step4/RemedialB2/TaskC.jsx'
import Phase4_2Step4RemedialB2TaskD from './pages/Phase4Step2/Step4/RemedialB2/TaskD.jsx'
import Phase4_2Step4RemedialB2Results from './pages/Phase4Step2/Step4/RemedialB2/Results.jsx'

// Phase 4.2 Step 4 Remedial C1 imports
import Phase4_2Step4RemedialC1TaskA from './pages/Phase4Step2/Step4/RemedialC1/TaskA.jsx'
import Phase4_2Step4RemedialC1TaskB from './pages/Phase4Step2/Step4/RemedialC1/TaskB.jsx'
import Phase4_2Step4RemedialC1TaskC from './pages/Phase4Step2/Step4/RemedialC1/TaskC.jsx'
import Phase4_2Step4RemedialC1TaskD from './pages/Phase4Step2/Step4/RemedialC1/TaskD.jsx'
import Phase4_2Step4RemedialC1TaskE from './pages/Phase4Step2/Step4/RemedialC1/TaskE.jsx'
import Phase4_2Step4RemedialC1TaskF from './pages/Phase4Step2/Step4/RemedialC1/TaskF.jsx'
import Phase4_2Step4RemedialC1TaskG from './pages/Phase4Step2/Step4/RemedialC1/TaskG.jsx'
import Phase4_2Step4RemedialC1TaskH from './pages/Phase4Step2/Step4/RemedialC1/TaskH.jsx'
import Phase4_2Step4RemedialC1Results from './pages/Phase4Step2/Step4/RemedialC1/Results.jsx'

// Phase 4.2 Step 5 Remedial A2 imports
import Phase4_2Step5RemedialA2TaskA from './pages/Phase4Step2/Step5/RemedialA2/TaskA.jsx'
import Phase4_2Step5RemedialA2TaskB from './pages/Phase4Step2/Step5/RemedialA2/TaskB.jsx'
import Phase4_2Step5RemedialA2TaskC from './pages/Phase4Step2/Step5/RemedialA2/TaskC.jsx'
import Phase4_2Step5RemedialA2Results from './pages/Phase4Step2/Step5/RemedialA2/Results.jsx'

// Phase 4.2 Step 5 Remedial B1 imports
import Phase4_2Step5RemedialB1TaskA from './pages/Phase4Step2/Step5/RemedialB1/TaskA.jsx'
import Phase4_2Step5RemedialB1TaskB from './pages/Phase4Step2/Step5/RemedialB1/TaskB.jsx'
import Phase4_2Step5RemedialB1TaskC from './pages/Phase4Step2/Step5/RemedialB1/TaskC.jsx'
import Phase4_2Step5RemedialB1TaskD from './pages/Phase4Step2/Step5/RemedialB1/TaskD.jsx'
import Phase4_2Step5RemedialB1Results from './pages/Phase4Step2/Step5/RemedialB1/Results.jsx'

// Phase 4.2 Step 5 Remedial B2 imports
import Phase4_2Step5RemedialB2TaskA from './pages/Phase4Step2/Step5/RemedialB2/TaskA.jsx'
import Phase4_2Step5RemedialB2TaskB from './pages/Phase4Step2/Step5/RemedialB2/TaskB.jsx'
import Phase4_2Step5RemedialB2TaskC from './pages/Phase4Step2/Step5/RemedialB2/TaskC.jsx'
import Phase4_2Step5RemedialB2TaskD from './pages/Phase4Step2/Step5/RemedialB2/TaskD.jsx'
import Phase4_2Step5RemedialB2Results from './pages/Phase4Step2/Step5/RemedialB2/Results.jsx'

// Phase 4.2 Step 5 Remedial C1 imports
import Phase4_2Step5RemedialC1TaskA from './pages/Phase4Step2/Step5/RemedialC1/TaskA.jsx'
import Phase4_2Step5RemedialC1TaskB from './pages/Phase4Step2/Step5/RemedialC1/TaskB.jsx'
import Phase4_2Step5RemedialC1TaskC from './pages/Phase4Step2/Step5/RemedialC1/TaskC.jsx'
import Phase4_2Step5RemedialC1TaskD from './pages/Phase4Step2/Step5/RemedialC1/TaskD.jsx'
import Phase4_2Step5RemedialC1Results from './pages/Phase4Step2/Step5/RemedialC1/Results.jsx'

// Phase 4 Step 5 Remedial imports
import Phase4Step5RemedialA1TaskA from './pages/Phase4Step5/RemedialA1/TaskA.jsx'
import Phase4Step5RemedialA1TaskB from './pages/Phase4Step5/RemedialA1/TaskB.jsx'
import Phase4Step5RemedialA1TaskC from './pages/Phase4Step5/RemedialA1/TaskC.jsx'
import Phase4Step5RemedialA2TaskA from './pages/Phase4Step5/RemedialA2/TaskA.jsx'
import Phase4Step5RemedialA2TaskB from './pages/Phase4Step5/RemedialA2/TaskB.jsx'
import Phase4Step5RemedialA2TaskC from './pages/Phase4Step5/RemedialA2/TaskC.jsx'
import Phase4Step5RemedialB1TaskA from './pages/Phase4Step5/RemedialB1/TaskA.jsx'
import Phase4Step5RemedialB1TaskB from './pages/Phase4Step5/RemedialB1/TaskB.jsx'
import Phase4Step5RemedialB1TaskC from './pages/Phase4Step5/RemedialB1/TaskC.jsx'
import Phase4Step5RemedialB1TaskD from './pages/Phase4Step5/RemedialB1/TaskD.jsx'
import Phase4Step5RemedialB1TaskE from './pages/Phase4Step5/RemedialB1/TaskE.jsx'
import Phase4Step5RemedialB1TaskF from './pages/Phase4Step5/RemedialB1/TaskF.jsx'
import Phase4Step5RemedialB1Results from './pages/Phase4Step5/RemedialB1/Results.jsx'
import Phase4Step5RemedialB2TaskA from './pages/Phase4Step5/RemedialB2/TaskA.jsx'
import Phase4Step5RemedialB2TaskB from './pages/Phase4Step5/RemedialB2/TaskB.jsx'
import Phase4Step5RemedialB2TaskC from './pages/Phase4Step5/RemedialB2/TaskC.jsx'
import Phase4Step5RemedialB2TaskD from './pages/Phase4Step5/RemedialB2/TaskD.jsx'
import Phase4Step5RemedialB2TaskE from './pages/Phase4Step5/RemedialB2/TaskE.jsx'
import Phase4Step5RemedialB2TaskF from './pages/Phase4Step5/RemedialB2/TaskF.jsx'
import Phase4Step5RemedialB2Results from './pages/Phase4Step5/RemedialB2/Results.jsx'
import Phase4Step5RemedialC1TaskA from './pages/Phase4Step5/RemedialC1/TaskA.jsx'
import Phase4Step5RemedialC1TaskB from './pages/Phase4Step5/RemedialC1/TaskB.jsx'
import Phase4Step5RemedialC1TaskC from './pages/Phase4Step5/RemedialC1/TaskC.jsx'
import Phase4Step5RemedialC1TaskD from './pages/Phase4Step5/RemedialC1/TaskD.jsx'
import Phase4Step5RemedialC1TaskE from './pages/Phase4Step5/RemedialC1/TaskE.jsx'
import Phase4Step5RemedialC1TaskF from './pages/Phase4Step5/RemedialC1/TaskF.jsx'
import Phase4Step5RemedialC1TaskG from './pages/Phase4Step5/RemedialC1/TaskG.jsx'
import Phase4Step5RemedialC1Results from './pages/Phase4Step5/RemedialC1/Results.jsx'

// Phase 4 Step 4 Remedial imports
import Phase4Step4RemedialA1TaskA from './pages/Phase4Step4/RemedialA1/TaskA.jsx'
import Phase4Step4RemedialA1TaskB from './pages/Phase4Step4/RemedialA1/TaskB.jsx'
import Phase4Step4RemedialA1TaskC from './pages/Phase4Step4/RemedialA1/TaskC.jsx'
import Phase4Step4RemedialA2TaskA from './pages/Phase4Step4/RemedialA2/TaskA.jsx'
import Phase4Step4RemedialA2TaskB from './pages/Phase4Step4/RemedialA2/TaskB.jsx'
import Phase4Step4RemedialA2TaskC from './pages/Phase4Step4/RemedialA2/TaskC.jsx'
import Phase4Step4RemedialB1TaskA from './pages/Phase4Step4/RemedialB1/TaskA.jsx'
import Phase4Step4RemedialB1TaskB from './pages/Phase4Step4/RemedialB1/TaskB.jsx'
import Phase4Step4RemedialB1TaskC from './pages/Phase4Step4/RemedialB1/TaskC.jsx'
import Phase4Step4RemedialB1TaskD from './pages/Phase4Step4/RemedialB1/TaskD.jsx'
import Phase4Step4RemedialB1TaskE from './pages/Phase4Step4/RemedialB1/TaskE.jsx'
import Phase4Step4RemedialB1TaskF from './pages/Phase4Step4/RemedialB1/TaskF.jsx'
import Phase4Step4RemedialB1Results from './pages/Phase4Step4/RemedialB1/Results.jsx'
import Phase4Step4RemedialB2TaskA from './pages/Phase4Step4/RemedialB2/TaskA.jsx'
import Phase4Step4RemedialB2TaskB from './pages/Phase4Step4/RemedialB2/TaskB.jsx'
import Phase4Step4RemedialB2TaskC from './pages/Phase4Step4/RemedialB2/TaskC.jsx'
import Phase4Step4RemedialB2TaskD from './pages/Phase4Step4/RemedialB2/TaskD.jsx'
import Phase4Step4RemedialB2Results from './pages/Phase4Step4/RemedialB2/Results.jsx'
import Phase4Step4RemedialC1TaskA from './pages/Phase4Step4/RemedialC1/TaskA.jsx'
import Phase4Step4RemedialC1TaskB from './pages/Phase4Step4/RemedialC1/TaskB.jsx'
import Phase4Step4RemedialC1TaskC from './pages/Phase4Step4/RemedialC1/TaskC.jsx'
import Phase4Step4RemedialC1TaskD from './pages/Phase4Step4/RemedialC1/TaskD.jsx'
import Phase4Step4RemedialC1Results from './pages/Phase4Step4/RemedialC1/Results.jsx'

// Phase 4 Step 1 Remedial imports - organized inside Phase4Step1 folder
import RemedialA1TaskA from './pages/Phase4Step1/RemedialA1/TaskA.jsx'
import RemedialA1TaskB from './pages/Phase4Step1/RemedialA1/TaskB.jsx'

import RemedialA2TaskA from './pages/Phase4Step1/RemedialA2/TaskA.jsx'
import RemedialA2TaskB from './pages/Phase4Step1/RemedialA2/TaskB.jsx'

import RemedialB1TaskA from './pages/Phase4Step1/RemedialB1/TaskA.jsx'
import RemedialB1TaskB from './pages/Phase4Step1/RemedialB1/TaskB.jsx'
import RemedialB1TaskC from './pages/Phase4Step1/RemedialB1/TaskC.jsx'
import RemedialB1TaskD from './pages/Phase4Step1/RemedialB1/TaskD.jsx'

import RemedialB2TaskA from './pages/Phase4Step1/RemedialB2/TaskA.jsx'
import RemedialB2TaskB from './pages/Phase4Step1/RemedialB2/TaskB.jsx'
import RemedialB2TaskC from './pages/Phase4Step1/RemedialB2/TaskC.jsx'
import RemedialB2TaskD from './pages/Phase4Step1/RemedialB2/TaskD.jsx'

import RemedialC1TaskA from './pages/Phase4Step1/RemedialC1/TaskA.jsx'
import RemedialC1TaskB from './pages/Phase4Step1/RemedialC1/TaskB.jsx'
import RemedialC1TaskC from './pages/Phase4Step1/RemedialC1/TaskC.jsx'
import RemedialC1TaskD from './pages/Phase4Step1/RemedialC1/TaskD.jsx'

// Phase 4 Step 3 Remedial imports
import RemedialStep3A1TaskA from './pages/Phase4Step3/RemedialA1/TaskA.jsx'
import RemedialStep3A1TaskB from './pages/Phase4Step3/RemedialA1/TaskB.jsx'
import RemedialStep3A1TaskC from './pages/Phase4Step3/RemedialA1/TaskC.jsx'

import RemedialStep3A2TaskA from './pages/Phase4Step3/RemedialA2/TaskA.jsx'
import RemedialStep3A2TaskB from './pages/Phase4Step3/RemedialA2/TaskB.jsx'
import RemedialStep3A2TaskC from './pages/Phase4Step3/RemedialA2/TaskC.jsx'

import RemedialStep3B1TaskA from './pages/Phase4Step3/RemedialB1/TaskA.jsx'
import RemedialStep3B1TaskB from './pages/Phase4Step3/RemedialB1/TaskB.jsx'
import RemedialStep3B1TaskC from './pages/Phase4Step3/RemedialB1/TaskC.jsx'
import RemedialStep3B1TaskD from './pages/Phase4Step3/RemedialB1/TaskD.jsx'
import RemedialStep3B1TaskE from './pages/Phase4Step3/RemedialB1/TaskE.jsx'
import RemedialStep3B1TaskF from './pages/Phase4Step3/RemedialB1/TaskF.jsx'
import RemedialStep3B1Results from './pages/Phase4Step3/RemedialB1/Results.jsx'

import RemedialStep3B2TaskA from './pages/Phase4Step3/RemedialB2/TaskA.jsx'
import RemedialStep3B2TaskB from './pages/Phase4Step3/RemedialB2/TaskB.jsx'
import RemedialStep3B2TaskC from './pages/Phase4Step3/RemedialB2/TaskC.jsx'
import RemedialStep3B2TaskD from './pages/Phase4Step3/RemedialB2/TaskD.jsx'
import RemedialStep3B2TaskE from './pages/Phase4Step3/RemedialB2/TaskE.jsx'
import RemedialStep3B2TaskF from './pages/Phase4Step3/RemedialB2/TaskF.jsx'
import RemedialStep3B2Results from './pages/Phase4Step3/RemedialB2/Results.jsx'

import RemedialStep3C1TaskA from './pages/Phase4Step3/RemedialC1/TaskA.jsx'
import RemedialStep3C1TaskB from './pages/Phase4Step3/RemedialC1/TaskB.jsx'
import RemedialStep3C1TaskC from './pages/Phase4Step3/RemedialC1/TaskC.jsx'
import RemedialStep3C1TaskD from './pages/Phase4Step3/RemedialC1/TaskD.jsx'
import RemedialStep3C1TaskE from './pages/Phase4Step3/RemedialC1/TaskE.jsx'
import RemedialStep3C1TaskF from './pages/Phase4Step3/RemedialC1/TaskF.jsx'
import RemedialStep3C1TaskG from './pages/Phase4Step3/RemedialC1/TaskG.jsx'
import RemedialStep3C1TaskH from './pages/Phase4Step3/RemedialC1/TaskH.jsx'

// Phase 5 Step 1 imports
import Phase5Step1Intro from './pages/Phase5SubPhase1Step1/index.jsx'
import Phase5Step1Interaction1 from './pages/Phase5SubPhase1Step1/Interaction1.jsx'
import Phase5Step1Interaction2 from './pages/Phase5SubPhase1Step1/Interaction2.jsx'
import Phase5Step1Interaction3 from './pages/Phase5SubPhase1Step1/Interaction3.jsx'
import Phase5Step1ScoreCalculation from './pages/Phase5SubPhase1Step1/ScoreCalculation.jsx'

// Phase 5 Step 1 Remedial imports
import Phase5Step1RemedialA1TaskA from './pages/Phase5SubPhase1Step1/RemedialA1/TaskA.jsx'
import Phase5Step1RemedialA1TaskB from './pages/Phase5SubPhase1Step1/RemedialA1/TaskB.jsx'
import Phase5Step1RemedialA1TaskC from './pages/Phase5SubPhase1Step1/RemedialA1/TaskC.jsx'
import Phase5Step1RemedialA2TaskA from './pages/Phase5SubPhase1Step1/RemedialA2/TaskA.jsx'
import Phase5Step1RemedialA2TaskB from './pages/Phase5SubPhase1Step1/RemedialA2/TaskB.jsx'
import Phase5Step1RemedialA2TaskC from './pages/Phase5SubPhase1Step1/RemedialA2/TaskC.jsx'
import Phase5Step1RemedialB1TaskA from './pages/Phase5SubPhase1Step1/RemedialB1/TaskA.jsx'
import Phase5Step1RemedialB1TaskB from './pages/Phase5SubPhase1Step1/RemedialB1/TaskB.jsx'
import Phase5Step1RemedialB1TaskC from './pages/Phase5SubPhase1Step1/RemedialB1/TaskC.jsx'
import Phase5Step1RemedialB1TaskD from './pages/Phase5SubPhase1Step1/RemedialB1/TaskD.jsx'
import Phase5Step1RemedialB1TaskE from './pages/Phase5SubPhase1Step1/RemedialB1/TaskE.jsx'
import Phase5Step1RemedialB1TaskF from './pages/Phase5SubPhase1Step1/RemedialB1/TaskF.jsx'
import Phase5Step1RemedialB1Results from './pages/Phase5SubPhase1Step1/RemedialB1/Results.jsx'
import Phase5Step1RemedialB2TaskA from './pages/Phase5SubPhase1Step1/RemedialB2/TaskA.jsx'
import Phase5Step1RemedialB2TaskB from './pages/Phase5SubPhase1Step1/RemedialB2/TaskB.jsx'
import Phase5Step1RemedialB2TaskC from './pages/Phase5SubPhase1Step1/RemedialB2/TaskC.jsx'
import Phase5Step1RemedialB2TaskD from './pages/Phase5SubPhase1Step1/RemedialB2/TaskD.jsx'
import Phase5Step1RemedialB2TaskE from './pages/Phase5SubPhase1Step1/RemedialB2/TaskE.jsx'
import Phase5Step1RemedialB2TaskF from './pages/Phase5SubPhase1Step1/RemedialB2/TaskF.jsx'
import Phase5Step1RemedialB2Results from './pages/Phase5SubPhase1Step1/RemedialB2/Results.jsx'
import Phase5Step1RemedialC1TaskA from './pages/Phase5SubPhase1Step1/RemedialC1/TaskA.jsx'
import Phase5Step1RemedialC1TaskB from './pages/Phase5SubPhase1Step1/RemedialC1/TaskB.jsx'
import Phase5Step1RemedialC1TaskC from './pages/Phase5SubPhase1Step1/RemedialC1/TaskC.jsx'
import Phase5Step1RemedialC1TaskD from './pages/Phase5SubPhase1Step1/RemedialC1/TaskD.jsx'
import Phase5Step1RemedialC1TaskE from './pages/Phase5SubPhase1Step1/RemedialC1/TaskE.jsx'
import Phase5Step1RemedialC1TaskF from './pages/Phase5SubPhase1Step1/RemedialC1/TaskF.jsx'
import Phase5Step1RemedialC1TaskG from './pages/Phase5SubPhase1Step1/RemedialC1/TaskG.jsx'
import Phase5Step1RemedialC1TaskH from './pages/Phase5SubPhase1Step1/RemedialC1/TaskH.jsx'

// Phase 5 Step 2 imports
import Phase5Step2Intro from './pages/Phase5SubPhase1Step2/index.jsx'
import Phase5Step2Interaction1 from './pages/Phase5SubPhase1Step2/Interaction1.jsx'
import Phase5Step2Interaction2 from './pages/Phase5SubPhase1Step2/Interaction2.jsx'
import Phase5Step2Interaction3 from './pages/Phase5SubPhase1Step2/Interaction3.jsx'
import Phase5Step2ScoreCalculation from './pages/Phase5SubPhase1Step2/ScoreCalculation.jsx'

// Phase 5 Step 2 Remedial imports
import Phase5Step2RemedialA2TaskA from './pages/Phase5SubPhase1Step2/RemedialA2/TaskA.jsx'
import Phase5Step2RemedialA2TaskB from './pages/Phase5SubPhase1Step2/RemedialA2/TaskB.jsx'
import Phase5Step2RemedialA2TaskC from './pages/Phase5SubPhase1Step2/RemedialA2/TaskC.jsx'
import Phase5Step2RemedialB1TaskA from './pages/Phase5SubPhase1Step2/RemedialB1/TaskA.jsx'
import Phase5Step2RemedialB1TaskB from './pages/Phase5SubPhase1Step2/RemedialB1/TaskB.jsx'
import Phase5Step2RemedialB1TaskC from './pages/Phase5SubPhase1Step2/RemedialB1/TaskC.jsx'
import Phase5Step2RemedialB2TaskA from './pages/Phase5SubPhase1Step2/RemedialB2/TaskA.jsx'
import Phase5Step2RemedialB2TaskB from './pages/Phase5SubPhase1Step2/RemedialB2/TaskB.jsx'
import Phase5Step2RemedialB2TaskC from './pages/Phase5SubPhase1Step2/RemedialB2/TaskC.jsx'
import Phase5Step2RemedialB2TaskD from './pages/Phase5SubPhase1Step2/RemedialB2/TaskD.jsx'
import Phase5Step2RemedialC1TaskA from './pages/Phase5SubPhase1Step2/RemedialC1/TaskA.jsx'
import Phase5Step2RemedialC1TaskB from './pages/Phase5SubPhase1Step2/RemedialC1/TaskB.jsx'
import Phase5Step2RemedialC1TaskC from './pages/Phase5SubPhase1Step2/RemedialC1/TaskC.jsx'
import Phase5Step2RemedialC1TaskD from './pages/Phase5SubPhase1Step2/RemedialC1/TaskD.jsx'

// Phase 5 Step 3 imports
import Phase5Step3Intro from './pages/Phase5SubPhase1Step3/index.jsx'
import Phase5Step3Interaction1 from './pages/Phase5SubPhase1Step3/Interaction1.jsx'
import Phase5Step3Interaction2 from './pages/Phase5SubPhase1Step3/Interaction2.jsx'
import Phase5Step3Interaction3 from './pages/Phase5SubPhase1Step3/Interaction3.jsx'
import Phase5Step3ScoreCalculation from './pages/Phase5SubPhase1Step3/ScoreCalculation.jsx'

// Phase 5 Step 3 Remedial imports
import Phase5Step3RemedialA2TaskA from './pages/Phase5SubPhase1Step3/RemedialA2/TaskA.jsx'
import Phase5Step3RemedialA2TaskB from './pages/Phase5SubPhase1Step3/RemedialA2/TaskB.jsx'
import Phase5Step3RemedialA2TaskC from './pages/Phase5SubPhase1Step3/RemedialA2/TaskC.jsx'
import Phase5Step3RemedialB1TaskA from './pages/Phase5SubPhase1Step3/RemedialB1/TaskA.jsx'
import Phase5Step3RemedialB1TaskB from './pages/Phase5SubPhase1Step3/RemedialB1/TaskB.jsx'
import Phase5Step3RemedialB1TaskC from './pages/Phase5SubPhase1Step3/RemedialB1/TaskC.jsx'
import Phase5Step3RemedialB2TaskA from './pages/Phase5SubPhase1Step3/RemedialB2/TaskA.jsx'
import Phase5Step3RemedialB2TaskB from './pages/Phase5SubPhase1Step3/RemedialB2/TaskB.jsx'
import Phase5Step3RemedialB2TaskC from './pages/Phase5SubPhase1Step3/RemedialB2/TaskC.jsx'
import Phase5Step3RemedialB2TaskD from './pages/Phase5SubPhase1Step3/RemedialB2/TaskD.jsx'
import Phase5Step3RemedialC1TaskA from './pages/Phase5SubPhase1Step3/RemedialC1/TaskA.jsx'
import Phase5Step3RemedialC1TaskB from './pages/Phase5SubPhase1Step3/RemedialC1/TaskB.jsx'
import Phase5Step3RemedialC1TaskC from './pages/Phase5SubPhase1Step3/RemedialC1/TaskC.jsx'
import Phase5Step3RemedialC1TaskD from './pages/Phase5SubPhase1Step3/RemedialC1/TaskD.jsx'

// Phase 5 Step 4 imports
import Phase5Step4Intro from './pages/Phase5SubPhase1Step4/index.jsx'
import Phase5Step4Interaction1 from './pages/Phase5SubPhase1Step4/Interaction1.jsx'
import Phase5Step4Interaction2 from './pages/Phase5SubPhase1Step4/Interaction2.jsx'
import Phase5Step4Interaction3 from './pages/Phase5SubPhase1Step4/Interaction3.jsx'
import Phase5Step4ScoreCalculation from './pages/Phase5SubPhase1Step4/ScoreCalculation.jsx'

// Phase 5 Step 4 Remedial imports
import Phase5Step4RemedialA2TaskA from './pages/Phase5SubPhase1Step4/RemedialA2/TaskA.jsx'
import Phase5Step4RemedialA2TaskB from './pages/Phase5SubPhase1Step4/RemedialA2/TaskB.jsx'
import Phase5Step4RemedialA2TaskC from './pages/Phase5SubPhase1Step4/RemedialA2/TaskC.jsx'
import Phase5Step4RemedialB1TaskA from './pages/Phase5SubPhase1Step4/RemedialB1/TaskA.jsx'
import Phase5Step4RemedialB1TaskB from './pages/Phase5SubPhase1Step4/RemedialB1/TaskB.jsx'
import Phase5Step4RemedialB1TaskC from './pages/Phase5SubPhase1Step4/RemedialB1/TaskC.jsx'
import Phase5Step4RemedialB2TaskA from './pages/Phase5SubPhase1Step4/RemedialB2/TaskA.jsx'
import Phase5Step4RemedialB2TaskB from './pages/Phase5SubPhase1Step4/RemedialB2/TaskB.jsx'
import Phase5Step4RemedialB2TaskC from './pages/Phase5SubPhase1Step4/RemedialB2/TaskC.jsx'
import Phase5Step4RemedialB2TaskD from './pages/Phase5SubPhase1Step4/RemedialB2/TaskD.jsx'
import Phase5Step4RemedialC1TaskA from './pages/Phase5SubPhase1Step4/RemedialC1/TaskA.jsx'
import Phase5Step4RemedialC1TaskB from './pages/Phase5SubPhase1Step4/RemedialC1/TaskB.jsx'
import Phase5Step4RemedialC1TaskC from './pages/Phase5SubPhase1Step4/RemedialC1/TaskC.jsx'
import Phase5Step4RemedialC1TaskD from './pages/Phase5SubPhase1Step4/RemedialC1/TaskD.jsx'

// Phase 5 Step 5 imports
import Phase5Step5Intro from './pages/Phase5SubPhase1Step5/index.jsx'
import Phase5Step5Interaction1 from './pages/Phase5SubPhase1Step5/Interaction1.jsx'
import Phase5Step5Interaction2 from './pages/Phase5SubPhase1Step5/Interaction2.jsx'
import Phase5Step5Interaction3 from './pages/Phase5SubPhase1Step5/Interaction3.jsx'
import Phase5Step5ScoreCalculation from './pages/Phase5SubPhase1Step5/ScoreCalculation.jsx'

// Phase 5 Step 5 Remedial imports
import Phase5Step5RemedialA2TaskA from './pages/Phase5SubPhase1Step5/RemedialA2/TaskA.jsx'
import Phase5Step5RemedialA2TaskB from './pages/Phase5SubPhase1Step5/RemedialA2/TaskB.jsx'
import Phase5Step5RemedialA2TaskC from './pages/Phase5SubPhase1Step5/RemedialA2/TaskC.jsx'
import Phase5Step5RemedialB1TaskA from './pages/Phase5SubPhase1Step5/RemedialB1/TaskA.jsx'
import Phase5Step5RemedialB1TaskB from './pages/Phase5SubPhase1Step5/RemedialB1/TaskB.jsx'
import Phase5Step5RemedialB1TaskC from './pages/Phase5SubPhase1Step5/RemedialB1/TaskC.jsx'
import Phase5Step5RemedialB2TaskA from './pages/Phase5SubPhase1Step5/RemedialB2/TaskA.jsx'
import Phase5Step5RemedialB2TaskB from './pages/Phase5SubPhase1Step5/RemedialB2/TaskB.jsx'
import Phase5Step5RemedialB2TaskC from './pages/Phase5SubPhase1Step5/RemedialB2/TaskC.jsx'
import Phase5Step5RemedialC1TaskA from './pages/Phase5SubPhase1Step5/RemedialC1/TaskA.jsx'
import Phase5Step5RemedialC1TaskB from './pages/Phase5SubPhase1Step5/RemedialC1/TaskB.jsx'
import Phase5Step5RemedialC1TaskC from './pages/Phase5SubPhase1Step5/RemedialC1/TaskC.jsx'
import Phase5Step5RemedialC1TaskD from './pages/Phase5SubPhase1Step5/RemedialC1/TaskD.jsx'

// Phase 5 SubPhase 2 Step 1 imports
import Phase5SubPhase2Step1Intro from './pages/Phase5SubPhase2Step1/index.jsx'
import Phase5SubPhase2Step1Interaction1 from './pages/Phase5SubPhase2Step1/Interaction1.jsx'
import Phase5SubPhase2Step1Interaction2 from './pages/Phase5SubPhase2Step1/Interaction2.jsx'
import Phase5SubPhase2Step1Interaction3 from './pages/Phase5SubPhase2Step1/Interaction3.jsx'
import Phase5SubPhase2Step1ScoreCalculation from './pages/Phase5SubPhase2Step1/ScoreCalculation.jsx'

// Phase 5 SubPhase 2 Step 1 Remedial imports
import Phase5SubPhase2Step1RemedialA2TaskA from './pages/Phase5SubPhase2Step1/RemedialA2/TaskA.jsx'
import Phase5SubPhase2Step1RemedialA2TaskB from './pages/Phase5SubPhase2Step1/RemedialA2/TaskB.jsx'
import Phase5SubPhase2Step1RemedialA2TaskC from './pages/Phase5SubPhase2Step1/RemedialA2/TaskC.jsx'
import Phase5SubPhase2Step1RemedialB1TaskA from './pages/Phase5SubPhase2Step1/RemedialB1/TaskA.jsx'
import Phase5SubPhase2Step1RemedialB1TaskB from './pages/Phase5SubPhase2Step1/RemedialB1/TaskB.jsx'
import Phase5SubPhase2Step1RemedialB1TaskC from './pages/Phase5SubPhase2Step1/RemedialB1/TaskC.jsx'
import Phase5SubPhase2Step1RemedialB2TaskA from './pages/Phase5SubPhase2Step1/RemedialB2/TaskA.jsx'
import Phase5SubPhase2Step1RemedialB2TaskB from './pages/Phase5SubPhase2Step1/RemedialB2/TaskB.jsx'
import Phase5SubPhase2Step1RemedialB2TaskC from './pages/Phase5SubPhase2Step1/RemedialB2/TaskC.jsx'
import Phase5SubPhase2Step1RemedialB2TaskD from './pages/Phase5SubPhase2Step1/RemedialB2/TaskD.jsx'
import Phase5SubPhase2Step1RemedialC1TaskA from './pages/Phase5SubPhase2Step1/RemedialC1/TaskA.jsx'
import Phase5SubPhase2Step1RemedialC1TaskB from './pages/Phase5SubPhase2Step1/RemedialC1/TaskB.jsx'
import Phase5SubPhase2Step1RemedialC1TaskC from './pages/Phase5SubPhase2Step1/RemedialC1/TaskC.jsx'
import Phase5SubPhase2Step1RemedialC1TaskD from './pages/Phase5SubPhase2Step1/RemedialC1/TaskD.jsx'

// Phase 5 SubPhase 2 Step 2 imports
import Phase5SubPhase2Step2Intro from './pages/Phase5SubPhase2Step2/index.jsx'
import Phase5SubPhase2Step2Interaction1 from './pages/Phase5SubPhase2Step2/Interaction1.jsx'
import Phase5SubPhase2Step2Interaction2 from './pages/Phase5SubPhase2Step2/Interaction2.jsx'
import Phase5SubPhase2Step2Interaction3 from './pages/Phase5SubPhase2Step2/Interaction3.jsx'
import Phase5SubPhase2Step2ScoreCalculation from './pages/Phase5SubPhase2Step2/ScoreCalculation.jsx'

// Phase 5 SubPhase 2 Step 3 imports
import Phase5SubPhase2Step3Intro from './pages/Phase5SubPhase2Step3/index.jsx'
import Phase5SubPhase2Step3Interaction1 from './pages/Phase5SubPhase2Step3/Interaction1.jsx'
import Phase5SubPhase2Step3Interaction2 from './pages/Phase5SubPhase2Step3/Interaction2.jsx'
import Phase5SubPhase2Step3Interaction3 from './pages/Phase5SubPhase2Step3/Interaction3.jsx'
import Phase5SubPhase2Step3ScoreCalculation from './pages/Phase5SubPhase2Step3/ScoreCalculation.jsx'
// Phase 5 SubPhase 2 Step 3 Remedial imports
import Phase5SubPhase2Step3RemedialA2TaskA from './pages/Phase5SubPhase2Step3/RemedialA2/TaskA.jsx'
import Phase5SubPhase2Step3RemedialA2TaskB from './pages/Phase5SubPhase2Step3/RemedialA2/TaskB.jsx'
import Phase5SubPhase2Step3RemedialA2TaskC from './pages/Phase5SubPhase2Step3/RemedialA2/TaskC.jsx'
import Phase5SubPhase2Step3RemedialB1TaskA from './pages/Phase5SubPhase2Step3/RemedialB1/TaskA.jsx'
import Phase5SubPhase2Step3RemedialB1TaskB from './pages/Phase5SubPhase2Step3/RemedialB1/TaskB.jsx'
import Phase5SubPhase2Step3RemedialB1TaskC from './pages/Phase5SubPhase2Step3/RemedialB1/TaskC.jsx'
import Phase5SubPhase2Step3RemedialB2TaskA from './pages/Phase5SubPhase2Step3/RemedialB2/TaskA.jsx'
import Phase5SubPhase2Step3RemedialB2TaskB from './pages/Phase5SubPhase2Step3/RemedialB2/TaskB.jsx'
import Phase5SubPhase2Step3RemedialB2TaskC from './pages/Phase5SubPhase2Step3/RemedialB2/TaskC.jsx'
import Phase5SubPhase2Step3RemedialB2TaskD from './pages/Phase5SubPhase2Step3/RemedialB2/TaskD.jsx'
import Phase5SubPhase2Step3RemedialC1TaskA from './pages/Phase5SubPhase2Step3/RemedialC1/TaskA.jsx'
import Phase5SubPhase2Step3RemedialC1TaskB from './pages/Phase5SubPhase2Step3/RemedialC1/TaskB.jsx'
import Phase5SubPhase2Step3RemedialC1TaskC from './pages/Phase5SubPhase2Step3/RemedialC1/TaskC.jsx'
import Phase5SubPhase2Step3RemedialC1TaskD from './pages/Phase5SubPhase2Step3/RemedialC1/TaskD.jsx'

// Phase 5 SubPhase 2 Step 4 imports
import Phase5SubPhase2Step4Intro from './pages/Phase5SubPhase2Step4/index.jsx'
import Phase5SubPhase2Step4Interaction1 from './pages/Phase5SubPhase2Step4/Interaction1.jsx'
import Phase5SubPhase2Step4Interaction2 from './pages/Phase5SubPhase2Step4/Interaction2.jsx'
import Phase5SubPhase2Step4Interaction3 from './pages/Phase5SubPhase2Step4/Interaction3.jsx'
import Phase5SubPhase2Step4ScoreCalculation from './pages/Phase5SubPhase2Step4/ScoreCalculation.jsx'
// Phase 5 SubPhase 2 Step 4 Remedial imports
import Phase5SubPhase2Step4RemedialA2TaskA from './pages/Phase5SubPhase2Step4/RemedialA2/TaskA.jsx'
import Phase5SubPhase2Step4RemedialA2TaskB from './pages/Phase5SubPhase2Step4/RemedialA2/TaskB.jsx'
import Phase5SubPhase2Step4RemedialA2TaskC from './pages/Phase5SubPhase2Step4/RemedialA2/TaskC.jsx'
import Phase5SubPhase2Step4RemedialB1TaskA from './pages/Phase5SubPhase2Step4/RemedialB1/TaskA.jsx'
import Phase5SubPhase2Step4RemedialB1TaskB from './pages/Phase5SubPhase2Step4/RemedialB1/TaskB.jsx'
import Phase5SubPhase2Step4RemedialB1TaskC from './pages/Phase5SubPhase2Step4/RemedialB1/TaskC.jsx'
import Phase5SubPhase2Step4RemedialB2TaskA from './pages/Phase5SubPhase2Step4/RemedialB2/TaskA.jsx'
import Phase5SubPhase2Step4RemedialB2TaskB from './pages/Phase5SubPhase2Step4/RemedialB2/TaskB.jsx'
import Phase5SubPhase2Step4RemedialB2TaskC from './pages/Phase5SubPhase2Step4/RemedialB2/TaskC.jsx'
import Phase5SubPhase2Step4RemedialB2TaskD from './pages/Phase5SubPhase2Step4/RemedialB2/TaskD.jsx'
import Phase5SubPhase2Step4RemedialC1TaskA from './pages/Phase5SubPhase2Step4/RemedialC1/TaskA.jsx'
import Phase5SubPhase2Step4RemedialC1TaskB from './pages/Phase5SubPhase2Step4/RemedialC1/TaskB.jsx'
import Phase5SubPhase2Step4RemedialC1TaskC from './pages/Phase5SubPhase2Step4/RemedialC1/TaskC.jsx'
import Phase5SubPhase2Step4RemedialC1TaskD from './pages/Phase5SubPhase2Step4/RemedialC1/TaskD.jsx'

// Phase 5 SubPhase 2 Step 5 imports
import Phase5SubPhase2Step5Intro from './pages/Phase5SubPhase2Step5/index.jsx'
import Phase5SubPhase2Step5Interaction1 from './pages/Phase5SubPhase2Step5/Interaction1.jsx'
import Phase5SubPhase2Step5Interaction2 from './pages/Phase5SubPhase2Step5/Interaction2.jsx'
import Phase5SubPhase2Step5Interaction3 from './pages/Phase5SubPhase2Step5/Interaction3.jsx'
import Phase5SubPhase2Step5ScoreCalculation from './pages/Phase5SubPhase2Step5/ScoreCalculation.jsx'
// Phase 5 SubPhase 2 Step 5 Remedial imports
import Phase5SubPhase2Step5RemedialA2TaskA from './pages/Phase5SubPhase2Step5/RemedialA2/TaskA.jsx'
import Phase5SubPhase2Step5RemedialA2TaskB from './pages/Phase5SubPhase2Step5/RemedialA2/TaskB.jsx'
import Phase5SubPhase2Step5RemedialA2TaskC from './pages/Phase5SubPhase2Step5/RemedialA2/TaskC.jsx'
import Phase5SubPhase2Step5RemedialB1TaskA from './pages/Phase5SubPhase2Step5/RemedialB1/TaskA.jsx'
import Phase5SubPhase2Step5RemedialB1TaskB from './pages/Phase5SubPhase2Step5/RemedialB1/TaskB.jsx'
import Phase5SubPhase2Step5RemedialB1TaskC from './pages/Phase5SubPhase2Step5/RemedialB1/TaskC.jsx'
import Phase5SubPhase2Step5RemedialB2TaskA from './pages/Phase5SubPhase2Step5/RemedialB2/TaskA.jsx'
import Phase5SubPhase2Step5RemedialB2TaskB from './pages/Phase5SubPhase2Step5/RemedialB2/TaskB.jsx'
import Phase5SubPhase2Step5RemedialB2TaskC from './pages/Phase5SubPhase2Step5/RemedialB2/TaskC.jsx'
import Phase5SubPhase2Step5RemedialB2TaskD from './pages/Phase5SubPhase2Step5/RemedialB2/TaskD.jsx'
import Phase5SubPhase2Step5RemedialC1TaskA from './pages/Phase5SubPhase2Step5/RemedialC1/TaskA.jsx'
import Phase5SubPhase2Step5RemedialC1TaskB from './pages/Phase5SubPhase2Step5/RemedialC1/TaskB.jsx'
import Phase5SubPhase2Step5RemedialC1TaskC from './pages/Phase5SubPhase2Step5/RemedialC1/TaskC.jsx'
import Phase5SubPhase2Step5RemedialC1TaskD from './pages/Phase5SubPhase2Step5/RemedialC1/TaskD.jsx'

// Phase 5 SubPhase 2 Step 2 Remedial imports
import Phase5SubPhase2Step2RemedialA2TaskA from './pages/Phase5SubPhase2Step2/RemedialA2/TaskA.jsx'
import Phase5SubPhase2Step2RemedialA2TaskB from './pages/Phase5SubPhase2Step2/RemedialA2/TaskB.jsx'
import Phase5SubPhase2Step2RemedialA2TaskC from './pages/Phase5SubPhase2Step2/RemedialA2/TaskC.jsx'
import Phase5SubPhase2Step2RemedialB1TaskA from './pages/Phase5SubPhase2Step2/RemedialB1/TaskA.jsx'
import Phase5SubPhase2Step2RemedialB1TaskB from './pages/Phase5SubPhase2Step2/RemedialB1/TaskB.jsx'
import Phase5SubPhase2Step2RemedialB1TaskC from './pages/Phase5SubPhase2Step2/RemedialB1/TaskC.jsx'
import Phase5SubPhase2Step2RemedialB2TaskA from './pages/Phase5SubPhase2Step2/RemedialB2/TaskA.jsx'
import Phase5SubPhase2Step2RemedialB2TaskB from './pages/Phase5SubPhase2Step2/RemedialB2/TaskB.jsx'
import Phase5SubPhase2Step2RemedialB2TaskC from './pages/Phase5SubPhase2Step2/RemedialB2/TaskC.jsx'
import Phase5SubPhase2Step2RemedialB2TaskD from './pages/Phase5SubPhase2Step2/RemedialB2/TaskD.jsx'
import Phase5SubPhase2Step2RemedialC1TaskA from './pages/Phase5SubPhase2Step2/RemedialC1/TaskA.jsx'
import Phase5SubPhase2Step2RemedialC1TaskB from './pages/Phase5SubPhase2Step2/RemedialC1/TaskB.jsx'
import Phase5SubPhase2Step2RemedialC1TaskC from './pages/Phase5SubPhase2Step2/RemedialC1/TaskC.jsx'
import Phase5SubPhase2Step2RemedialC1TaskD from './pages/Phase5SubPhase2Step2/RemedialC1/TaskD.jsx'

import Certificate from './pages/Certificate.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import DeleteAccount from './pages/DeleteAccount.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminUserList from './pages/AdminUserList.jsx'
import AdminUserViewer from './pages/AdminUserViewer.jsx'
import AdminAnalytics from './pages/AdminAnalytics.jsx'
import AdminChat from './pages/AdminChat.jsx'
import StudentChat from './pages/StudentChat.jsx'
import NotFound from './pages/NotFound.jsx'
import { ApiProvider, useAuth } from './lib/api.jsx'
import LandingLayout from './components/LandingLayout.jsx'
import AppLayout from './components/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import { ConfettiCannon } from './components/gamification'
import ErrorBoundary from './components/ErrorBoundary.jsx'



// Phase 6 Complete
import Phase6Complete from './pages/Phase6Complete.jsx'
// Phase 6 SubPhase 1 imports
import P6SP1S1Intro from './pages/Phase6SubPhase1Step1/index.jsx'
import P6SP1S1Int1 from './pages/Phase6SubPhase1Step1/Interaction1.jsx'
import P6SP1S1Int2 from './pages/Phase6SubPhase1Step1/Interaction2.jsx'
import P6SP1S1Int3 from './pages/Phase6SubPhase1Step1/Interaction3.jsx'
import P6SP1S1Score from './pages/Phase6SubPhase1Step1/ScoreCalculation.jsx'
import P6SP1S1RemA2TaskA from './pages/Phase6SubPhase1Step1/RemedialA2/TaskA.jsx'
import P6SP1S1RemA2TaskB from './pages/Phase6SubPhase1Step1/RemedialA2/TaskB.jsx'
import P6SP1S1RemA2TaskC from './pages/Phase6SubPhase1Step1/RemedialA2/TaskC.jsx'
import P6SP1S1RemB1TaskA from './pages/Phase6SubPhase1Step1/RemedialB1/TaskA.jsx'
import P6SP1S1RemB1TaskB from './pages/Phase6SubPhase1Step1/RemedialB1/TaskB.jsx'
import P6SP1S1RemB1TaskC from './pages/Phase6SubPhase1Step1/RemedialB1/TaskC.jsx'
import P6SP1S1RemB2TaskA from './pages/Phase6SubPhase1Step1/RemedialB2/TaskA.jsx'
import P6SP1S1RemB2TaskB from './pages/Phase6SubPhase1Step1/RemedialB2/TaskB.jsx'
import P6SP1S1RemB2TaskC from './pages/Phase6SubPhase1Step1/RemedialB2/TaskC.jsx'
import P6SP1S1RemB2TaskD from './pages/Phase6SubPhase1Step1/RemedialB2/TaskD.jsx'
import P6SP1S1RemC1TaskA from './pages/Phase6SubPhase1Step1/RemedialC1/TaskA.jsx'
import P6SP1S1RemC1TaskB from './pages/Phase6SubPhase1Step1/RemedialC1/TaskB.jsx'
import P6SP1S1RemC1TaskC from './pages/Phase6SubPhase1Step1/RemedialC1/TaskC.jsx'
import P6SP1S1RemC1TaskD from './pages/Phase6SubPhase1Step1/RemedialC1/TaskD.jsx'

import P6SP1S2Intro from './pages/Phase6SubPhase1Step2/index.jsx'
import P6SP1S2Int1 from './pages/Phase6SubPhase1Step2/Interaction1.jsx'
import P6SP1S2Int2 from './pages/Phase6SubPhase1Step2/Interaction2.jsx'
import P6SP1S2Int3 from './pages/Phase6SubPhase1Step2/Interaction3.jsx'
import P6SP1S2Score from './pages/Phase6SubPhase1Step2/ScoreCalculation.jsx'
import P6SP1S2RemA2TaskA from './pages/Phase6SubPhase1Step2/RemedialA2/TaskA.jsx'
import P6SP1S2RemA2TaskB from './pages/Phase6SubPhase1Step2/RemedialA2/TaskB.jsx'
import P6SP1S2RemA2TaskC from './pages/Phase6SubPhase1Step2/RemedialA2/TaskC.jsx'
import P6SP1S2RemB1TaskA from './pages/Phase6SubPhase1Step2/RemedialB1/TaskA.jsx'
import P6SP1S2RemB1TaskB from './pages/Phase6SubPhase1Step2/RemedialB1/TaskB.jsx'
import P6SP1S2RemB1TaskC from './pages/Phase6SubPhase1Step2/RemedialB1/TaskC.jsx'
import P6SP1S2RemB2TaskA from './pages/Phase6SubPhase1Step2/RemedialB2/TaskA.jsx'
import P6SP1S2RemB2TaskB from './pages/Phase6SubPhase1Step2/RemedialB2/TaskB.jsx'
import P6SP1S2RemB2TaskC from './pages/Phase6SubPhase1Step2/RemedialB2/TaskC.jsx'
import P6SP1S2RemB2TaskD from './pages/Phase6SubPhase1Step2/RemedialB2/TaskD.jsx'
import P6SP1S2RemC1TaskA from './pages/Phase6SubPhase1Step2/RemedialC1/TaskA.jsx'
import P6SP1S2RemC1TaskB from './pages/Phase6SubPhase1Step2/RemedialC1/TaskB.jsx'
import P6SP1S2RemC1TaskC from './pages/Phase6SubPhase1Step2/RemedialC1/TaskC.jsx'

import P6SP1S3Intro from './pages/Phase6SubPhase1Step3/index.jsx'
import P6SP1S3Int1 from './pages/Phase6SubPhase1Step3/Interaction1.jsx'
import P6SP1S3Int2 from './pages/Phase6SubPhase1Step3/Interaction2.jsx'
import P6SP1S3Int3 from './pages/Phase6SubPhase1Step3/Interaction3.jsx'
import P6SP1S3Score from './pages/Phase6SubPhase1Step3/ScoreCalculation.jsx'
import P6SP1S3RemA2TaskA from './pages/Phase6SubPhase1Step3/RemedialA2/TaskA.jsx'
import P6SP1S3RemA2TaskB from './pages/Phase6SubPhase1Step3/RemedialA2/TaskB.jsx'
import P6SP1S3RemA2TaskC from './pages/Phase6SubPhase1Step3/RemedialA2/TaskC.jsx'
import P6SP1S3RemB1TaskA from './pages/Phase6SubPhase1Step3/RemedialB1/TaskA.jsx'
import P6SP1S3RemB1TaskB from './pages/Phase6SubPhase1Step3/RemedialB1/TaskB.jsx'
import P6SP1S3RemB1TaskC from './pages/Phase6SubPhase1Step3/RemedialB1/TaskC.jsx'
import P6SP1S3RemB2TaskA from './pages/Phase6SubPhase1Step3/RemedialB2/TaskA.jsx'
import P6SP1S3RemB2TaskB from './pages/Phase6SubPhase1Step3/RemedialB2/TaskB.jsx'
import P6SP1S3RemB2TaskC from './pages/Phase6SubPhase1Step3/RemedialB2/TaskC.jsx'
import P6SP1S3RemB2TaskD from './pages/Phase6SubPhase1Step3/RemedialB2/TaskD.jsx'
import P6SP1S3RemC1TaskA from './pages/Phase6SubPhase1Step3/RemedialC1/TaskA.jsx'
import P6SP1S3RemC1TaskB from './pages/Phase6SubPhase1Step3/RemedialC1/TaskB.jsx'
import P6SP1S3RemC1TaskC from './pages/Phase6SubPhase1Step3/RemedialC1/TaskC.jsx'
import P6SP1S3RemC1TaskD from './pages/Phase6SubPhase1Step3/RemedialC1/TaskD.jsx'

import P6SP1S4Intro from './pages/Phase6SubPhase1Step4/index.jsx'
import P6SP1S4Int1 from './pages/Phase6SubPhase1Step4/Interaction1.jsx'
import P6SP1S4Int2 from './pages/Phase6SubPhase1Step4/Interaction2.jsx'
import P6SP1S4Int3 from './pages/Phase6SubPhase1Step4/Interaction3.jsx'
import P6SP1S4Score from './pages/Phase6SubPhase1Step4/ScoreCalculation.jsx'
import P6SP1S4RemA2TaskA from './pages/Phase6SubPhase1Step4/RemedialA2/TaskA.jsx'
import P6SP1S4RemA2TaskB from './pages/Phase6SubPhase1Step4/RemedialA2/TaskB.jsx'
import P6SP1S4RemA2TaskC from './pages/Phase6SubPhase1Step4/RemedialA2/TaskC.jsx'
import P6SP1S4RemB1TaskA from './pages/Phase6SubPhase1Step4/RemedialB1/TaskA.jsx'
import P6SP1S4RemB1TaskB from './pages/Phase6SubPhase1Step4/RemedialB1/TaskB.jsx'
import P6SP1S4RemB1TaskC from './pages/Phase6SubPhase1Step4/RemedialB1/TaskC.jsx'
import P6SP1S4RemB2TaskA from './pages/Phase6SubPhase1Step4/RemedialB2/TaskA.jsx'
import P6SP1S4RemB2TaskB from './pages/Phase6SubPhase1Step4/RemedialB2/TaskB.jsx'
import P6SP1S4RemB2TaskC from './pages/Phase6SubPhase1Step4/RemedialB2/TaskC.jsx'
import P6SP1S4RemB2TaskD from './pages/Phase6SubPhase1Step4/RemedialB2/TaskD.jsx'
import P6SP1S4RemC1TaskA from './pages/Phase6SubPhase1Step4/RemedialC1/TaskA.jsx'
import P6SP1S4RemC1TaskB from './pages/Phase6SubPhase1Step4/RemedialC1/TaskB.jsx'
import P6SP1S4RemC1TaskC from './pages/Phase6SubPhase1Step4/RemedialC1/TaskC.jsx'
import P6SP1S4RemC1TaskD from './pages/Phase6SubPhase1Step4/RemedialC1/TaskD.jsx'

import P6SP1S5Intro from './pages/Phase6SubPhase1Step5/index.jsx'
import P6SP1S5Int1 from './pages/Phase6SubPhase1Step5/Interaction1.jsx'
import P6SP1S5Int2 from './pages/Phase6SubPhase1Step5/Interaction2.jsx'
import P6SP1S5Int3 from './pages/Phase6SubPhase1Step5/Interaction3.jsx'
import P6SP1S5Score from './pages/Phase6SubPhase1Step5/ScoreCalculation.jsx'
import P6SP1S5RemA2TaskA from './pages/Phase6SubPhase1Step5/RemedialA2/TaskA.jsx'
import P6SP1S5RemA2TaskB from './pages/Phase6SubPhase1Step5/RemedialA2/TaskB.jsx'
import P6SP1S5RemA2TaskC from './pages/Phase6SubPhase1Step5/RemedialA2/TaskC.jsx'
import P6SP1S5RemB1TaskA from './pages/Phase6SubPhase1Step5/RemedialB1/TaskA.jsx'
import P6SP1S5RemB1TaskB from './pages/Phase6SubPhase1Step5/RemedialB1/TaskB.jsx'
import P6SP1S5RemB1TaskC from './pages/Phase6SubPhase1Step5/RemedialB1/TaskC.jsx'
import P6SP1S5RemB2TaskA from './pages/Phase6SubPhase1Step5/RemedialB2/TaskA.jsx'
import P6SP1S5RemB2TaskB from './pages/Phase6SubPhase1Step5/RemedialB2/TaskB.jsx'
import P6SP1S5RemB2TaskC from './pages/Phase6SubPhase1Step5/RemedialB2/TaskC.jsx'
import P6SP1S5RemC1TaskA from './pages/Phase6SubPhase1Step5/RemedialC1/TaskA.jsx'
import P6SP1S5RemC1TaskB from './pages/Phase6SubPhase1Step5/RemedialC1/TaskB.jsx'
import P6SP1S5RemC1TaskC from './pages/Phase6SubPhase1Step5/RemedialC1/TaskC.jsx'
import P6SP1S5RemC1TaskD from './pages/Phase6SubPhase1Step5/RemedialC1/TaskD.jsx'

// Phase 6 SubPhase 2 imports
import P6SP2S1Intro from './pages/Phase6SubPhase2Step1/index.jsx'
import P6SP2S1Int1 from './pages/Phase6SubPhase2Step1/Interaction1.jsx'
import P6SP2S1Int2 from './pages/Phase6SubPhase2Step1/Interaction2.jsx'
import P6SP2S1Int3 from './pages/Phase6SubPhase2Step1/Interaction3.jsx'
import P6SP2S1Score from './pages/Phase6SubPhase2Step1/ScoreCalculation.jsx'
import P6SP2S1RemA2TaskA from './pages/Phase6SubPhase2Step1/RemedialA2/TaskA.jsx'
import P6SP2S1RemA2TaskB from './pages/Phase6SubPhase2Step1/RemedialA2/TaskB.jsx'
import P6SP2S1RemA2TaskC from './pages/Phase6SubPhase2Step1/RemedialA2/TaskC.jsx'
import P6SP2S1RemB1TaskA from './pages/Phase6SubPhase2Step1/RemedialB1/TaskA.jsx'
import P6SP2S1RemB1TaskB from './pages/Phase6SubPhase2Step1/RemedialB1/TaskB.jsx'
import P6SP2S1RemB1TaskC from './pages/Phase6SubPhase2Step1/RemedialB1/TaskC.jsx'
import P6SP2S1RemB2TaskA from './pages/Phase6SubPhase2Step1/RemedialB2/TaskA.jsx'
import P6SP2S1RemB2TaskB from './pages/Phase6SubPhase2Step1/RemedialB2/TaskB.jsx'
import P6SP2S1RemB2TaskC from './pages/Phase6SubPhase2Step1/RemedialB2/TaskC.jsx'
import P6SP2S1RemB2TaskD from './pages/Phase6SubPhase2Step1/RemedialB2/TaskD.jsx'
import P6SP2S1RemC1TaskA from './pages/Phase6SubPhase2Step1/RemedialC1/TaskA.jsx'
import P6SP2S1RemC1TaskB from './pages/Phase6SubPhase2Step1/RemedialC1/TaskB.jsx'
import P6SP2S1RemC1TaskC from './pages/Phase6SubPhase2Step1/RemedialC1/TaskC.jsx'

import P6SP2S2Intro from './pages/Phase6SubPhase2Step2/index.jsx'
import P6SP2S2Int1 from './pages/Phase6SubPhase2Step2/Interaction1.jsx'
import P6SP2S2Int2 from './pages/Phase6SubPhase2Step2/Interaction2.jsx'
import P6SP2S2Int3 from './pages/Phase6SubPhase2Step2/Interaction3.jsx'
import P6SP2S2Score from './pages/Phase6SubPhase2Step2/ScoreCalculation.jsx'
import P6SP2S2RemA2TaskA from './pages/Phase6SubPhase2Step2/RemedialA2/TaskA.jsx'
import P6SP2S2RemA2TaskB from './pages/Phase6SubPhase2Step2/RemedialA2/TaskB.jsx'
import P6SP2S2RemA2TaskC from './pages/Phase6SubPhase2Step2/RemedialA2/TaskC.jsx'
import P6SP2S2RemB1TaskA from './pages/Phase6SubPhase2Step2/RemedialB1/TaskA.jsx'
import P6SP2S2RemB1TaskB from './pages/Phase6SubPhase2Step2/RemedialB1/TaskB.jsx'
import P6SP2S2RemB1TaskC from './pages/Phase6SubPhase2Step2/RemedialB1/TaskC.jsx'
import P6SP2S2RemB2TaskA from './pages/Phase6SubPhase2Step2/RemedialB2/TaskA.jsx'
import P6SP2S2RemB2TaskB from './pages/Phase6SubPhase2Step2/RemedialB2/TaskB.jsx'
import P6SP2S2RemB2TaskC from './pages/Phase6SubPhase2Step2/RemedialB2/TaskC.jsx'
import P6SP2S2RemB2TaskD from './pages/Phase6SubPhase2Step2/RemedialB2/TaskD.jsx'
import P6SP2S2RemC1TaskA from './pages/Phase6SubPhase2Step2/RemedialC1/TaskA.jsx'
import P6SP2S2RemC1TaskB from './pages/Phase6SubPhase2Step2/RemedialC1/TaskB.jsx'
import P6SP2S2RemC1TaskC from './pages/Phase6SubPhase2Step2/RemedialC1/TaskC.jsx'

import P6SP2S3Intro from './pages/Phase6SubPhase2Step3/index.jsx'
import P6SP2S3Int1 from './pages/Phase6SubPhase2Step3/Interaction1.jsx'
import P6SP2S3Int2 from './pages/Phase6SubPhase2Step3/Interaction2.jsx'
import P6SP2S3Int3 from './pages/Phase6SubPhase2Step3/Interaction3.jsx'
import P6SP2S3Score from './pages/Phase6SubPhase2Step3/ScoreCalculation.jsx'
import P6SP2S3RemA2TaskA from './pages/Phase6SubPhase2Step3/RemedialA2/TaskA.jsx'
import P6SP2S3RemA2TaskB from './pages/Phase6SubPhase2Step3/RemedialA2/TaskB.jsx'
import P6SP2S3RemA2TaskC from './pages/Phase6SubPhase2Step3/RemedialA2/TaskC.jsx'
import P6SP2S3RemB1TaskA from './pages/Phase6SubPhase2Step3/RemedialB1/TaskA.jsx'
import P6SP2S3RemB1TaskB from './pages/Phase6SubPhase2Step3/RemedialB1/TaskB.jsx'
import P6SP2S3RemB1TaskC from './pages/Phase6SubPhase2Step3/RemedialB1/TaskC.jsx'
import P6SP2S3RemB2TaskA from './pages/Phase6SubPhase2Step3/RemedialB2/TaskA.jsx'
import P6SP2S3RemB2TaskB from './pages/Phase6SubPhase2Step3/RemedialB2/TaskB.jsx'
import P6SP2S3RemB2TaskC from './pages/Phase6SubPhase2Step3/RemedialB2/TaskC.jsx'
import P6SP2S3RemB2TaskD from './pages/Phase6SubPhase2Step3/RemedialB2/TaskD.jsx'
import P6SP2S3RemC1TaskA from './pages/Phase6SubPhase2Step3/RemedialC1/TaskA.jsx'
import P6SP2S3RemC1TaskB from './pages/Phase6SubPhase2Step3/RemedialC1/TaskB.jsx'
import P6SP2S3RemC1TaskC from './pages/Phase6SubPhase2Step3/RemedialC1/TaskC.jsx'
import P6SP2S3RemC1TaskD from './pages/Phase6SubPhase2Step3/RemedialC1/TaskD.jsx'

import P6SP2S4Intro from './pages/Phase6SubPhase2Step4/index.jsx'
import P6SP2S4Int1 from './pages/Phase6SubPhase2Step4/Interaction1.jsx'
import P6SP2S4Int2 from './pages/Phase6SubPhase2Step4/Interaction2.jsx'
import P6SP2S4Int3 from './pages/Phase6SubPhase2Step4/Interaction3.jsx'
import P6SP2S4Score from './pages/Phase6SubPhase2Step4/ScoreCalculation.jsx'
import P6SP2S4RemA2TaskA from './pages/Phase6SubPhase2Step4/RemedialA2/TaskA.jsx'
import P6SP2S4RemA2TaskB from './pages/Phase6SubPhase2Step4/RemedialA2/TaskB.jsx'
import P6SP2S4RemA2TaskC from './pages/Phase6SubPhase2Step4/RemedialA2/TaskC.jsx'
import P6SP2S4RemB1TaskA from './pages/Phase6SubPhase2Step4/RemedialB1/TaskA.jsx'
import P6SP2S4RemB1TaskB from './pages/Phase6SubPhase2Step4/RemedialB1/TaskB.jsx'
import P6SP2S4RemB1TaskC from './pages/Phase6SubPhase2Step4/RemedialB1/TaskC.jsx'
import P6SP2S4RemB2TaskA from './pages/Phase6SubPhase2Step4/RemedialB2/TaskA.jsx'
import P6SP2S4RemB2TaskB from './pages/Phase6SubPhase2Step4/RemedialB2/TaskB.jsx'
import P6SP2S4RemB2TaskC from './pages/Phase6SubPhase2Step4/RemedialB2/TaskC.jsx'
import P6SP2S4RemB2TaskD from './pages/Phase6SubPhase2Step4/RemedialB2/TaskD.jsx'
import P6SP2S4RemC1TaskA from './pages/Phase6SubPhase2Step4/RemedialC1/TaskA.jsx'
import P6SP2S4RemC1TaskB from './pages/Phase6SubPhase2Step4/RemedialC1/TaskB.jsx'
import P6SP2S4RemC1TaskC from './pages/Phase6SubPhase2Step4/RemedialC1/TaskC.jsx'
import P6SP2S4RemC1TaskD from './pages/Phase6SubPhase2Step4/RemedialC1/TaskD.jsx'

import P6SP2S5Intro from './pages/Phase6SubPhase2Step5/index.jsx'
import P6SP2S5Int1 from './pages/Phase6SubPhase2Step5/Interaction1.jsx'
import P6SP2S5Int2 from './pages/Phase6SubPhase2Step5/Interaction2.jsx'
import P6SP2S5Int3 from './pages/Phase6SubPhase2Step5/Interaction3.jsx'
import P6SP2S5Score from './pages/Phase6SubPhase2Step5/ScoreCalculation.jsx'
import P6SP2S5RemA2TaskA from './pages/Phase6SubPhase2Step5/RemedialA2/TaskA.jsx'
import P6SP2S5RemA2TaskB from './pages/Phase6SubPhase2Step5/RemedialA2/TaskB.jsx'
import P6SP2S5RemA2TaskC from './pages/Phase6SubPhase2Step5/RemedialA2/TaskC.jsx'
import P6SP2S5RemB1TaskA from './pages/Phase6SubPhase2Step5/RemedialB1/TaskA.jsx'
import P6SP2S5RemB1TaskB from './pages/Phase6SubPhase2Step5/RemedialB1/TaskB.jsx'
import P6SP2S5RemB1TaskC from './pages/Phase6SubPhase2Step5/RemedialB1/TaskC.jsx'
import P6SP2S5RemB2TaskA from './pages/Phase6SubPhase2Step5/RemedialB2/TaskA.jsx'
import P6SP2S5RemB2TaskB from './pages/Phase6SubPhase2Step5/RemedialB2/TaskB.jsx'
import P6SP2S5RemB2TaskC from './pages/Phase6SubPhase2Step5/RemedialB2/TaskC.jsx'
import P6SP2S5RemC1TaskA from './pages/Phase6SubPhase2Step5/RemedialC1/TaskA.jsx'
import P6SP2S5RemC1TaskB from './pages/Phase6SubPhase2Step5/RemedialC1/TaskB.jsx'
import P6SP2S5RemC1TaskC from './pages/Phase6SubPhase2Step5/RemedialC1/TaskC.jsx'
import P6SP2S5RemC1TaskD from './pages/Phase6SubPhase2Step5/RemedialC1/TaskD.jsx'

function App() {
  return (
    <ErrorBoundary>
      <ApiProvider>
        <ConfettiCannon />
          <Routes>
          {/* Public routes — SaaS top bar */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Authenticated routes — Sidebar */}
          <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/phase-journey" element={<PhaseJourney />} />
          <Route path="/game" element={<Navigate to="/phase1/interaction/1" replace />} />
          <Route path="/phase1/interaction/:step" element={<Game />} />
          <Route path="/results" element={<Results />} />
          <Route path="/certificate" element={<Certificate />} />

          {/* Phase 2 Routes */}
          <Route path="/phase2" element={<Phase2Intro />} />
          <Route path="/phase2/step/:stepId" element={<Phase2Step />} />
          <Route path="/phase2/step/:stepId/results" element={<Phase2StepResults />} />
          <Route path="/phase2/remedial/:stepId/:level" element={<Phase2Remedial />} />
          <Route path="/phase2/complete" element={<Phase2Complete />} />

          {/* Phase 3 Routes */}
          <Route path="/phase3/step/1" element={<Phase3Step1Intro />} />
          <Route path="/app/phase3/step/1" element={<Phase3Step1Intro />} />
          <Route path="/phase3/step/1/interaction/1" element={<Phase3Step1Interaction1 />} />
          <Route path="/app/phase3/step/1/interaction/1" element={<Phase3Step1Interaction1 />} />
          <Route path="/phase3/step/1/interaction/2" element={<Phase3Step1Interaction2 />} />
          <Route path="/app/phase3/step/1/interaction/2" element={<Phase3Step1Interaction2 />} />
          <Route path="/phase3/step/1/interaction/3" element={<Phase3Step1Interaction3 />} />
          <Route path="/app/phase3/step/1/interaction/3" element={<Phase3Step1Interaction3 />} />
          <Route path="/phase3/step/1/score" element={<Phase3Step1ScoreCalculation />} />
          <Route path="/app/phase3/step/1/score" element={<Phase3Step1ScoreCalculation />} />

          {/* Phase 3 Step 1 Remedial Routes (only A1 has Task B) */}
          <Route path="/phase3/step/1/remedial/a1/taskA" element={<Phase3Step1RemedialA1TaskA />} />
          <Route path="/app/phase3/step/1/remedial/a1/taskA" element={<Phase3Step1RemedialA1TaskA />} />
          <Route path="/phase3/step/1/remedial/a1/taskB" element={<Phase3Step1RemedialA1TaskB />} />
          <Route path="/app/phase3/step/1/remedial/a1/taskB" element={<Phase3Step1RemedialA1TaskB />} />

          <Route path="/phase3/step/1/remedial/a2/taskA" element={<Phase3Step1RemedialA2TaskA />} />
          <Route path="/phase3/step/1/remedial/a2/taskB" element={<Phase3Step1RemedialA2TaskB />} />
          <Route path="/phase3/step/1/remedial/a2/taskC" element={<Phase3Step1RemedialA2TaskC />} />
          <Route path="/phase3/step/1/remedial/a2/taskD" element={<Phase3Step1RemedialA2TaskD />} />
          <Route path="/app/phase3/step/1/remedial/a2/taskA" element={<Phase3Step1RemedialA2TaskA />} />
          <Route path="/app/phase3/step/1/remedial/a2/taskB" element={<Phase3Step1RemedialA2TaskB />} />
          <Route path="/app/phase3/step/1/remedial/a2/taskC" element={<Phase3Step1RemedialA2TaskC />} />
          <Route path="/app/phase3/step/1/remedial/a2/taskD" element={<Phase3Step1RemedialA2TaskD />} />

          <Route path="/phase3/step/1/remedial/b1/taskA" element={<Phase3Step1RemedialB1TaskA />} />
          <Route path="/app/phase3/step/1/remedial/b1/taskA" element={<Phase3Step1RemedialB1TaskA />} />

          <Route path="/phase3/step/1/remedial/b2/taskA" element={<Phase3Step1RemedialB2TaskA />} />
          <Route path="/app/phase3/step/1/remedial/b2/taskA" element={<Phase3Step1RemedialB2TaskA />} />

          <Route path="/phase3/step/1/remedial/c1/taskA" element={<Phase3Step1RemedialC1TaskA />} />
          <Route path="/app/phase3/step/1/remedial/c1/taskA" element={<Phase3Step1RemedialC1TaskA />} />

          {/* Phase 3 Step 2 Routes */}
          <Route path="/phase3/step/2" element={<Phase3Step2Intro />} />
          <Route path="/app/phase3/step/2" element={<Phase3Step2Intro />} />
          <Route path="/phase3/step/2/interaction/1" element={<Phase3Step2Interaction1 />} />
          <Route path="/app/phase3/step/2/interaction/1" element={<Phase3Step2Interaction1 />} />
          <Route path="/phase3/step/2/interaction/2" element={<Phase3Step2Interaction2 />} />
          <Route path="/app/phase3/step/2/interaction/2" element={<Phase3Step2Interaction2 />} />
          <Route path="/phase3/step/2/interaction/3" element={<Phase3Step2Interaction3 />} />
          <Route path="/app/phase3/step/2/interaction/3" element={<Phase3Step2Interaction3 />} />
          <Route path="/phase3/step/2/score" element={<Phase3Step2ScoreCalculation />} />
          <Route path="/app/phase3/step/2/score" element={<Phase3Step2ScoreCalculation />} />

          {/* Phase 3 Step 2 Remedial Routes */}
          <Route path="/phase3/step/2/remedial/a1/taskA" element={<Phase3Step2RemedialA1TaskA />} />
          <Route path="/app/phase3/step/2/remedial/a1/taskA" element={<Phase3Step2RemedialA1TaskA />} />

          <Route path="/phase3/step/2/remedial/a2/taskA" element={<Phase3Step2RemedialA2TaskA />} />
          <Route path="/app/phase3/step/2/remedial/a2/taskA" element={<Phase3Step2RemedialA2TaskA />} />

          <Route path="/phase3/step/2/remedial/b1/taskA" element={<Phase3Step2RemedialB1TaskA />} />
          <Route path="/app/phase3/step/2/remedial/b1/taskA" element={<Phase3Step2RemedialB1TaskA />} />

          <Route path="/phase3/step/2/remedial/b2/taskA" element={<Phase3Step2RemedialB2TaskA />} />
          <Route path="/app/phase3/step/2/remedial/b2/taskA" element={<Phase3Step2RemedialB2TaskA />} />

          <Route path="/phase3/step/2/remedial/c1/taskA" element={<Phase3Step2RemedialC1TaskA />} />
          <Route path="/app/phase3/step/2/remedial/c1/taskA" element={<Phase3Step2RemedialC1TaskA />} />

          {/* Phase 3 Step 3 Routes */}
          <Route path="/phase3/step/3" element={<Phase3Step3Intro />} />
          <Route path="/app/phase3/step/3" element={<Phase3Step3Intro />} />
          <Route path="/phase3/step/3/interaction/1" element={<Phase3Step3Interaction1 />} />
          <Route path="/app/phase3/step/3/interaction/1" element={<Phase3Step3Interaction1 />} />
          <Route path="/phase3/step/3/interaction/2" element={<Phase3Step3Interaction2 />} />
          <Route path="/app/phase3/step/3/interaction/2" element={<Phase3Step3Interaction2 />} />
          <Route path="/phase3/step/3/interaction/3" element={<Phase3Step3Interaction3 />} />
          <Route path="/app/phase3/step/3/interaction/3" element={<Phase3Step3Interaction3 />} />
          <Route path="/phase3/step/3/score" element={<Phase3Step3ScoreCalculation />} />
          <Route path="/app/phase3/step/3/score" element={<Phase3Step3ScoreCalculation />} />

          {/* Phase 3 Step 3 Remedial Routes */}
          <Route path="/phase3/step/3/remedial/a1/taskA" element={<Phase3Step3RemedialA1TaskA />} />
          <Route path="/app/phase3/step/3/remedial/a1/taskA" element={<Phase3Step3RemedialA1TaskA />} />

          <Route path="/phase3/step/3/remedial/a2/taskA" element={<Phase3Step3RemedialA2TaskA />} />
          <Route path="/app/phase3/step/3/remedial/a2/taskA" element={<Phase3Step3RemedialA2TaskA />} />

          <Route path="/phase3/step/3/remedial/b1/taskA" element={<Phase3Step3RemedialB1TaskA />} />
          <Route path="/app/phase3/step/3/remedial/b1/taskA" element={<Phase3Step3RemedialB1TaskA />} />

          <Route path="/phase3/step/3/remedial/b2/taskA" element={<Phase3Step3RemedialB2TaskA />} />
          <Route path="/app/phase3/step/3/remedial/b2/taskA" element={<Phase3Step3RemedialB2TaskA />} />

          <Route path="/phase3/step/3/remedial/c1/taskA" element={<Phase3Step3RemedialC1TaskA />} />
          <Route path="/app/phase3/step/3/remedial/c1/taskA" element={<Phase3Step3RemedialC1TaskA />} />

          {/* Phase 3 Step 4 Routes */}
          <Route path="/phase3/step/4" element={<Phase3Step4Intro />} />
          <Route path="/app/phase3/step/4" element={<Phase3Step4Intro />} />
          <Route path="/phase3/step/4/interaction/1" element={<Phase3Step4Interaction1 />} />
          <Route path="/app/phase3/step/4/interaction/1" element={<Phase3Step4Interaction1 />} />
          <Route path="/phase3/step/4/interaction/2" element={<Phase3Step4Interaction2 />} />
          <Route path="/app/phase3/step/4/interaction/2" element={<Phase3Step4Interaction2 />} />
          <Route path="/phase3/step/4/score" element={<Phase3Step4ScoreCalculation />} />
          <Route path="/app/phase3/step/4/score" element={<Phase3Step4ScoreCalculation />} />

          {/* Phase 3 Step 4 Remedial Routes */}
          <Route path="/phase3/step/4/remedial/a1/taskA" element={<Phase3Step4RemedialA1TaskA />} />
          <Route path="/app/phase3/step/4/remedial/a1/taskA" element={<Phase3Step4RemedialA1TaskA />} />

          <Route path="/phase3/step/4/remedial/a2/taskA" element={<Phase3Step4RemedialA2TaskA />} />
          <Route path="/app/phase3/step/4/remedial/a2/taskA" element={<Phase3Step4RemedialA2TaskA />} />

          <Route path="/phase3/step/4/remedial/b1/taskA" element={<Phase3Step4RemedialB1TaskA />} />
          <Route path="/app/phase3/step/4/remedial/b1/taskA" element={<Phase3Step4RemedialB1TaskA />} />

          <Route path="/phase3/step/4/remedial/b2/taskA" element={<Phase3Step4RemedialB2TaskA />} />
          <Route path="/app/phase3/step/4/remedial/b2/taskA" element={<Phase3Step4RemedialB2TaskA />} />

          <Route path="/phase3/step/4/remedial/c1/taskA" element={<Phase3Step4RemedialC1TaskA />} />
          <Route path="/app/phase3/step/4/remedial/c1/taskA" element={<Phase3Step4RemedialC1TaskA />} />

          {/* Phase 4 & 5 Completion Routes */}
          <Route path="/phase4/complete" element={<Phase4Complete />} />
          <Route path="/phase5/complete" element={<Phase5Complete />} />

          {/* Phase 4 Routes */}
          <Route path="/phase4/step/1" element={<Phase4Step1Intro />} />
          <Route path="/phase4/step/1/interaction/1" element={<Phase4Step1Interaction1 />} />
          <Route path="/phase4/step/1/interaction/2" element={<Phase4Step1Interaction2 />} />
          <Route path="/phase4/step/1/interaction/3" element={<Phase4Step1Interaction3 />} />
          <Route path="/phase4/step/3" element={<Phase4Step3Intro />} />
          <Route path="/phase4/step/3/vocabulary" element={<Phase4Step3VocabularyWarmup />} />
          <Route path="/phase4/step/3/interaction/1" element={<Phase4Step3Interaction1 />} />
          <Route path="/phase4/step/3/interaction/2" element={<Phase4Step3Interaction2 />} />
          <Route path="/phase4/step/3/interaction/3" element={<Phase4Step3Interaction3 />} />

          {/* Phase 4 Step 4 Routes */}
          <Route path="/phase4/step/4" element={<Phase4Step4Intro />} />
          <Route path="/phase4/step/4/interaction/1" element={<Phase4Step4Interaction1 />} />
          <Route path="/phase4/step/4/interaction/2" element={<Phase4Step4Interaction2 />} />
          <Route path="/phase4/step/4/interaction/3" element={<Phase4Step4Interaction3 />} />

          {/* Phase 4 Step 5 Routes */}
          <Route path="/phase4/step/5" element={<Phase4Step5Intro />} />
          <Route path="/phase4/step/5/interaction/1" element={<Phase4Step5Interaction1 />} />
          <Route path="/phase4/step/5/interaction/2" element={<Phase4Step5Interaction2 />} />
          <Route path="/phase4/step/5/interaction/3" element={<Phase4Step5Interaction3 />} />

          {/* Phase 4 Step 5 Remedial A1 Routes */}
          <Route path="/phase4/step/5/remedial/a1/taskA" element={<Phase4Step5RemedialA1TaskA />} />
          <Route path="/phase4/step/5/remedial/a1/taskB" element={<Phase4Step5RemedialA1TaskB />} />
          <Route path="/phase4/step/5/remedial/a1/taskC" element={<Phase4Step5RemedialA1TaskC />} />

          {/* Phase 4 Step 5 Remedial A2 Routes */}
          <Route path="/phase4/step/5/remedial/a2/taskA" element={<Phase4Step5RemedialA2TaskA />} />
          <Route path="/phase4/step/5/remedial/a2/taskB" element={<Phase4Step5RemedialA2TaskB />} />
          <Route path="/phase4/step/5/remedial/a2/taskC" element={<Phase4Step5RemedialA2TaskC />} />

          {/* Phase 4 Step 5 Remedial B1 Routes */}
          <Route path="/phase4/step/5/remedial/b1/taskA" element={<Phase4Step5RemedialB1TaskA />} />
          <Route path="/phase4/step/5/remedial/b1/taskB" element={<Phase4Step5RemedialB1TaskB />} />
          <Route path="/phase4/step/5/remedial/b1/taskC" element={<Phase4Step5RemedialB1TaskC />} />
          <Route path="/phase4/step/5/remedial/b1/taskD" element={<Phase4Step5RemedialB1TaskD />} />
          <Route path="/phase4/step/5/remedial/b1/taskE" element={<Phase4Step5RemedialB1TaskE />} />
          <Route path="/phase4/step/5/remedial/b1/taskF" element={<Phase4Step5RemedialB1TaskF />} />
          <Route path="/phase4/step/5/remedial/b1/results" element={<Phase4Step5RemedialB1Results />} />

          {/* Phase 4 Step 5 Remedial B2 Routes */}
          <Route path="/phase4/step/5/remedial/b2/taskA" element={<Phase4Step5RemedialB2TaskA />} />
          <Route path="/phase4/step/5/remedial/b2/taskB" element={<Phase4Step5RemedialB2TaskB />} />
          <Route path="/phase4/step/5/remedial/b2/taskC" element={<Phase4Step5RemedialB2TaskC />} />
          <Route path="/phase4/step/5/remedial/b2/taskD" element={<Phase4Step5RemedialB2TaskD />} />
          <Route path="/phase4/step/5/remedial/b2/taskE" element={<Phase4Step5RemedialB2TaskE />} />
          <Route path="/phase4/step/5/remedial/b2/taskF" element={<Phase4Step5RemedialB2TaskF />} />
          <Route path="/phase4/step/5/remedial/b2/results" element={<Phase4Step5RemedialB2Results />} />

          {/* Phase 4 Step 5 Remedial C1 Routes */}
          <Route path="/phase4/step/5/remedial/c1/taskA" element={<Phase4Step5RemedialC1TaskA />} />
          <Route path="/phase4/step/5/remedial/c1/taskB" element={<Phase4Step5RemedialC1TaskB />} />
          <Route path="/phase4/step/5/remedial/c1/taskC" element={<Phase4Step5RemedialC1TaskC />} />
          <Route path="/phase4/step/5/remedial/c1/taskD" element={<Phase4Step5RemedialC1TaskD />} />
          <Route path="/phase4/step/5/remedial/c1/taskE" element={<Phase4Step5RemedialC1TaskE />} />
          <Route path="/phase4/step/5/remedial/c1/taskF" element={<Phase4Step5RemedialC1TaskF />} />
          <Route path="/app/phase4/step/5/remedial/c1/taskF" element={<Phase4Step5RemedialC1TaskF />} />
          <Route path="/phase4/step/5/remedial/c1/taskG" element={<Phase4Step5RemedialC1TaskG />} />
          <Route path="/phase4/step/5/remedial/c1/results" element={<Phase4Step5RemedialC1Results />} />

          {/* Phase 4.2 Step 1 Routes - Social Media Marketing */}
          <Route path="/phase4_2/step/1" element={<Phase4_2Step1Intro />} />
          <Route path="/app/phase4_2/step/1" element={<Phase4_2Step1Intro />} />
          <Route path="/phase4_2/step/1/interaction/1" element={<Phase4_2Step1Interaction1 />} />
          <Route path="/app/phase4_2/step/1/interaction/1" element={<Phase4_2Step1Interaction1 />} />
          <Route path="/phase4_2/step/1/interaction/2" element={<Phase4_2Step1Interaction2 />} />
          <Route path="/app/phase4_2/step/1/interaction/2" element={<Phase4_2Step1Interaction2 />} />
          <Route path="/phase4_2/step/1/interaction/3" element={<Phase4_2Step1Interaction3 />} />
          <Route path="/app/phase4_2/step/1/interaction/3" element={<Phase4_2Step1Interaction3 />} />

          {/* Phase 4.2 Step 2 Routes - Social Media Marketing */}
          <Route path="/phase4_2/step/2" element={<Phase4_2Step2Intro />} />
          <Route path="/app/phase4_2/step/2" element={<Phase4_2Step2Intro />} />
          <Route path="/phase4_2/step/2/interaction/1" element={<Phase4_2Step2Interaction1 />} />
          <Route path="/app/phase4_2/step/2/interaction/1" element={<Phase4_2Step2Interaction1 />} />
          <Route path="/phase4_2/step/2/interaction/2" element={<Phase4_2Step2Interaction2 />} />
          <Route path="/app/phase4_2/step/2/interaction/2" element={<Phase4_2Step2Interaction2 />} />
          <Route path="/phase4_2/step/2/interaction/3" element={<Phase4_2Step2Interaction3 />} />
          <Route path="/app/phase4_2/step/2/interaction/3" element={<Phase4_2Step2Interaction3 />} />

          {/* Phase 4.2 Step 3 Routes - Social Media Marketing */}
          <Route path="/phase4_2/step/3" element={<Phase4_2Step3Intro />} />
          <Route path="/app/phase4_2/step/3" element={<Phase4_2Step3Intro />} />
          <Route path="/phase4_2/step/3/interaction/1" element={<Phase4_2Step3Interaction1 />} />
          <Route path="/app/phase4_2/step/3/interaction/1" element={<Phase4_2Step3Interaction1 />} />
          <Route path="/phase4_2/step/3/interaction/2" element={<Phase4_2Step3Interaction2 />} />
          <Route path="/app/phase4_2/step/3/interaction/2" element={<Phase4_2Step3Interaction2 />} />
          <Route path="/phase4_2/step/3/interaction/3" element={<Phase4_2Step3Interaction3 />} />
          <Route path="/app/phase4_2/step/3/interaction/3" element={<Phase4_2Step3Interaction3 />} />

          {/* Phase 4.2 Step 4 Routes - Social Media Marketing */}
          <Route path="/phase4_2/step/4" element={<Phase4_2Step4Intro />} />
          <Route path="/app/phase4_2/step/4" element={<Phase4_2Step4Intro />} />
          <Route path="/phase4_2/step/4/interaction/1" element={<Phase4_2Step4Interaction1 />} />
          <Route path="/app/phase4_2/step/4/interaction/1" element={<Phase4_2Step4Interaction1 />} />
          <Route path="/phase4_2/step/4/interaction/2" element={<Phase4_2Step4Interaction2 />} />
          <Route path="/app/phase4_2/step/4/interaction/2" element={<Phase4_2Step4Interaction2 />} />
          <Route path="/phase4_2/step/4/interaction/3" element={<Phase4_2Step4Interaction3 />} />
          <Route path="/app/phase4_2/step/4/interaction/3" element={<Phase4_2Step4Interaction3 />} />

          {/* Phase 4.2 Step 5 Routes - Error Correction & Evaluation */}
          <Route path="/phase4_2/step/5" element={<Phase4_2Step5Intro />} />
          <Route path="/app/phase4_2/step/5" element={<Phase4_2Step5Intro />} />
          <Route path="/phase4_2/step/5/interaction/1" element={<Phase4_2Step5Interaction1 />} />
          <Route path="/app/phase4_2/step/5/interaction/1" element={<Phase4_2Step5Interaction1 />} />
          <Route path="/phase4_2/step/5/interaction/2" element={<Phase4_2Step5Interaction2 />} />
          <Route path="/app/phase4_2/step/5/interaction/2" element={<Phase4_2Step5Interaction2 />} />
          <Route path="/phase4_2/step/5/interaction/3" element={<Phase4_2Step5Interaction3 />} />
          <Route path="/app/phase4_2/step/5/interaction/3" element={<Phase4_2Step5Interaction3 />} />

          {/* Phase 4.2 Step 1 Remedial A1 Routes */}
          <Route path="/phase4_2/step/1/remedial/a1/taskA" element={<Phase4_2Step1RemedialA1TaskA />} />
          <Route path="/app/phase4_2/step/1/remedial/a1/taskA" element={<Phase4_2Step1RemedialA1TaskA />} />
          <Route path="/phase4_2/step/1/remedial/a1/taskB" element={<Phase4_2Step1RemedialA1TaskB />} />
          <Route path="/app/phase4_2/step/1/remedial/a1/taskB" element={<Phase4_2Step1RemedialA1TaskB />} />
          <Route path="/phase4_2/step/1/remedial/a1/taskC" element={<Phase4_2Step1RemedialA1TaskC />} />
          <Route path="/app/phase4_2/step/1/remedial/a1/taskC" element={<Phase4_2Step1RemedialA1TaskC />} />
          <Route path="/phase4_2/step/1/remedial/a1/results" element={<Phase4_2Step1RemedialA1Results />} />
          <Route path="/app/phase4_2/step/1/remedial/a1/results" element={<Phase4_2Step1RemedialA1Results />} />

          {/* Phase 4.2 Step 1 Remedial A2 Routes */}
          <Route path="/phase4_2/step/1/remedial/a2/taskA" element={<Phase4_2Step1RemedialA2TaskA />} />
          <Route path="/app/phase4_2/step/1/remedial/a2/taskA" element={<Phase4_2Step1RemedialA2TaskA />} />
          <Route path="/phase4_2/step/1/remedial/a2/taskB" element={<Phase4_2Step1RemedialA2TaskB />} />
          <Route path="/app/phase4_2/step/1/remedial/a2/taskB" element={<Phase4_2Step1RemedialA2TaskB />} />
          <Route path="/phase4_2/step/1/remedial/a2/taskC" element={<Phase4_2Step1RemedialA2TaskC />} />
          <Route path="/app/phase4_2/step/1/remedial/a2/taskC" element={<Phase4_2Step1RemedialA2TaskC />} />
          <Route path="/phase4_2/step/1/remedial/a2/results" element={<Phase4_2Step1RemedialA2Results />} />
          <Route path="/app/phase4_2/step/1/remedial/a2/results" element={<Phase4_2Step1RemedialA2Results />} />

          {/* Phase 4.2 Step 1 Remedial B1 Routes */}
          <Route path="/phase4_2/step/1/remedial/b1/taskA" element={<Phase4_2Step1RemedialB1TaskA />} />
          <Route path="/app/phase4_2/step/1/remedial/b1/taskA" element={<Phase4_2Step1RemedialB1TaskA />} />
          <Route path="/phase4_2/step/1/remedial/b1/taskB" element={<Phase4_2Step1RemedialB1TaskB />} />
          <Route path="/app/phase4_2/step/1/remedial/b1/taskB" element={<Phase4_2Step1RemedialB1TaskB />} />
          <Route path="/phase4_2/step/1/remedial/b1/taskC" element={<Phase4_2Step1RemedialB1TaskC />} />
          <Route path="/app/phase4_2/step/1/remedial/b1/taskC" element={<Phase4_2Step1RemedialB1TaskC />} />
          <Route path="/phase4_2/step/1/remedial/b1/taskD" element={<Phase4_2Step1RemedialB1TaskD />} />
          <Route path="/app/phase4_2/step/1/remedial/b1/taskD" element={<Phase4_2Step1RemedialB1TaskD />} />
          <Route path="/phase4_2/step/1/remedial/b1/taskE" element={<Phase4_2Step1RemedialB1TaskE />} />
          <Route path="/app/phase4_2/step/1/remedial/b1/taskE" element={<Phase4_2Step1RemedialB1TaskE />} />
          <Route path="/phase4_2/step/1/remedial/b1/taskF" element={<Phase4_2Step1RemedialB1TaskF />} />
          <Route path="/app/phase4_2/step/1/remedial/b1/taskF" element={<Phase4_2Step1RemedialB1TaskF />} />
          <Route path="/phase4_2/step/1/remedial/b1/results" element={<Phase4_2Step1RemedialB1Results />} />
          <Route path="/app/phase4_2/step/1/remedial/b1/results" element={<Phase4_2Step1RemedialB1Results />} />

          {/* Phase 4.2 Step 1 Remedial B2 Routes */}
          <Route path="/phase4_2/step/1/remedial/b2/taskA" element={<Phase4_2Step1RemedialB2TaskA />} />
          <Route path="/app/phase4_2/step/1/remedial/b2/taskA" element={<Phase4_2Step1RemedialB2TaskA />} />
          <Route path="/phase4_2/step/1/remedial/b2/taskB" element={<Phase4_2Step1RemedialB2TaskB />} />
          <Route path="/app/phase4_2/step/1/remedial/b2/taskB" element={<Phase4_2Step1RemedialB2TaskB />} />
          <Route path="/phase4_2/step/1/remedial/b2/taskC" element={<Phase4_2Step1RemedialB2TaskC />} />
          <Route path="/app/phase4_2/step/1/remedial/b2/taskC" element={<Phase4_2Step1RemedialB2TaskC />} />
          <Route path="/phase4_2/step/1/remedial/b2/taskD" element={<Phase4_2Step1RemedialB2TaskD />} />
          <Route path="/app/phase4_2/step/1/remedial/b2/taskD" element={<Phase4_2Step1RemedialB2TaskD />} />
          <Route path="/phase4_2/step/1/remedial/b2/taskE" element={<Phase4_2Step1RemedialB2TaskE />} />
          <Route path="/app/phase4_2/step/1/remedial/b2/taskE" element={<Phase4_2Step1RemedialB2TaskE />} />
          <Route path="/phase4_2/step/1/remedial/b2/taskF" element={<Phase4_2Step1RemedialB2TaskF />} />
          <Route path="/app/phase4_2/step/1/remedial/b2/taskF" element={<Phase4_2Step1RemedialB2TaskF />} />
          <Route path="/phase4_2/step/1/remedial/b2/results" element={<Phase4_2Step1RemedialB2Results />} />
          <Route path="/app/phase4_2/step/1/remedial/b2/results" element={<Phase4_2Step1RemedialB2Results />} />

          {/* Phase 4.2 Step 1 Remedial C1 Routes */}
          <Route path="/phase4_2/step/1/remedial/c1/taskA" element={<Phase4_2Step1RemedialC1TaskA />} />
          <Route path="/app/phase4_2/step/1/remedial/c1/taskA" element={<Phase4_2Step1RemedialC1TaskA />} />
          <Route path="/phase4_2/step/1/remedial/c1/taskB" element={<Phase4_2Step1RemedialC1TaskB />} />
          <Route path="/app/phase4_2/step/1/remedial/c1/taskB" element={<Phase4_2Step1RemedialC1TaskB />} />
          <Route path="/phase4_2/step/1/remedial/c1/taskC" element={<Phase4_2Step1RemedialC1TaskC />} />
          <Route path="/app/phase4_2/step/1/remedial/c1/taskC" element={<Phase4_2Step1RemedialC1TaskC />} />
          <Route path="/phase4_2/step/1/remedial/c1/taskD" element={<Phase4_2Step1RemedialC1TaskD />} />
          <Route path="/app/phase4_2/step/1/remedial/c1/taskD" element={<Phase4_2Step1RemedialC1TaskD />} />
          <Route path="/phase4_2/step/1/remedial/c1/taskE" element={<Phase4_2Step1RemedialC1TaskE />} />
          <Route path="/app/phase4_2/step/1/remedial/c1/taskE" element={<Phase4_2Step1RemedialC1TaskE />} />
          <Route path="/phase4_2/step/1/remedial/c1/taskF" element={<Phase4_2Step1RemedialC1TaskF />} />
          <Route path="/app/phase4_2/step/1/remedial/c1/taskF" element={<Phase4_2Step1RemedialC1TaskF />} />
          <Route path="/phase4_2/step/1/remedial/c1/taskG" element={<Phase4_2Step1RemedialC1TaskG />} />
          <Route path="/app/phase4_2/step/1/remedial/c1/taskG" element={<Phase4_2Step1RemedialC1TaskG />} />
          <Route path="/phase4_2/step/1/remedial/c1/taskH" element={<Phase4_2Step1RemedialC1TaskH />} />
          <Route path="/app/phase4_2/step/1/remedial/c1/taskH" element={<Phase4_2Step1RemedialC1TaskH />} />
          <Route path="/phase4_2/step/1/remedial/c1/results" element={<Phase4_2Step1RemedialC1Results />} />
          <Route path="/app/phase4_2/step/1/remedial/c1/results" element={<Phase4_2Step1RemedialC1Results />} />

          {/* Phase 4.2 Step 2 Remedial A2 Routes */}
          <Route path="/phase4_2/step/2/remedial/a2/taskA" element={<Phase4_2Step2RemedialA2TaskA />} />
          <Route path="/app/phase4_2/step/2/remedial/a2/taskA" element={<Phase4_2Step2RemedialA2TaskA />} />
          <Route path="/phase4_2/step/2/remedial/a2/taskB" element={<Phase4_2Step2RemedialA2TaskB />} />
          <Route path="/app/phase4_2/step/2/remedial/a2/taskB" element={<Phase4_2Step2RemedialA2TaskB />} />
          <Route path="/phase4_2/step/2/remedial/a2/taskC" element={<Phase4_2Step2RemedialA2TaskC />} />
          <Route path="/app/phase4_2/step/2/remedial/a2/taskC" element={<Phase4_2Step2RemedialA2TaskC />} />
          <Route path="/phase4_2/step/2/remedial/a2/results" element={<Phase4_2Step2RemedialA2Results />} />
          <Route path="/app/phase4_2/step/2/remedial/a2/results" element={<Phase4_2Step2RemedialA2Results />} />

          {/* Phase 4.2 Step 2 Remedial B1 Routes */}
          <Route path="/phase4_2/step/2/remedial/b1/taskA" element={<Phase4_2Step2RemedialB1TaskA />} />
          <Route path="/app/phase4_2/step/2/remedial/b1/taskA" element={<Phase4_2Step2RemedialB1TaskA />} />
          <Route path="/phase4_2/step/2/remedial/b1/taskB" element={<Phase4_2Step2RemedialB1TaskB />} />
          <Route path="/app/phase4_2/step/2/remedial/b1/taskB" element={<Phase4_2Step2RemedialB1TaskB />} />
          <Route path="/phase4_2/step/2/remedial/b1/taskC" element={<Phase4_2Step2RemedialB1TaskC />} />
          <Route path="/app/phase4_2/step/2/remedial/b1/taskC" element={<Phase4_2Step2RemedialB1TaskC />} />
          <Route path="/phase4_2/step/2/remedial/b1/results" element={<Phase4_2Step2RemedialB1Results />} />
          <Route path="/app/phase4_2/step/2/remedial/b1/results" element={<Phase4_2Step2RemedialB1Results />} />

          {/* Phase 4.2 Step 2 Remedial B2 Routes */}
          <Route path="/phase4_2/step/2/remedial/b2/taskA" element={<Phase4_2Step2RemedialB2TaskA />} />
          <Route path="/app/phase4_2/step/2/remedial/b2/taskA" element={<Phase4_2Step2RemedialB2TaskA />} />
          <Route path="/phase4_2/step/2/remedial/b2/taskB" element={<Phase4_2Step2RemedialB2TaskB />} />
          <Route path="/app/phase4_2/step/2/remedial/b2/taskB" element={<Phase4_2Step2RemedialB2TaskB />} />
          <Route path="/phase4_2/step/2/remedial/b2/taskC" element={<Phase4_2Step2RemedialB2TaskC />} />
          <Route path="/app/phase4_2/step/2/remedial/b2/taskC" element={<Phase4_2Step2RemedialB2TaskC />} />
          <Route path="/phase4_2/step/2/remedial/b2/taskD" element={<Phase4_2Step2RemedialB2TaskD />} />
          <Route path="/app/phase4_2/step/2/remedial/b2/taskD" element={<Phase4_2Step2RemedialB2TaskD />} />
          <Route path="/phase4_2/step/2/remedial/b2/results" element={<Phase4_2Step2RemedialB2Results />} />
          <Route path="/app/phase4_2/step/2/remedial/b2/results" element={<Phase4_2Step2RemedialB2Results />} />

          {/* Phase 4.2 Step 2 Remedial C1 Routes */}
          <Route path="/phase4_2/step/2/remedial/c1/taskA" element={<Phase4_2Step2RemedialC1TaskA />} />
          <Route path="/app/phase4_2/step/2/remedial/c1/taskA" element={<Phase4_2Step2RemedialC1TaskA />} />
          <Route path="/phase4_2/step/2/remedial/c1/taskB" element={<Phase4_2Step2RemedialC1TaskB />} />
          <Route path="/app/phase4_2/step/2/remedial/c1/taskB" element={<Phase4_2Step2RemedialC1TaskB />} />
          <Route path="/phase4_2/step/2/remedial/c1/taskC" element={<Phase4_2Step2RemedialC1TaskC />} />
          <Route path="/app/phase4_2/step/2/remedial/c1/taskC" element={<Phase4_2Step2RemedialC1TaskC />} />
          <Route path="/phase4_2/step/2/remedial/c1/taskD" element={<Phase4_2Step2RemedialC1TaskD />} />
          <Route path="/app/phase4_2/step/2/remedial/c1/taskD" element={<Phase4_2Step2RemedialC1TaskD />} />
          <Route path="/phase4_2/step/2/remedial/c1/taskE" element={<Phase4_2Step2RemedialC1TaskE />} />
          <Route path="/app/phase4_2/step/2/remedial/c1/taskE" element={<Phase4_2Step2RemedialC1TaskE />} />
          <Route path="/phase4_2/step/2/remedial/c1/taskF" element={<Phase4_2Step2RemedialC1TaskF />} />
          <Route path="/app/phase4_2/step/2/remedial/c1/taskF" element={<Phase4_2Step2RemedialC1TaskF />} />
          <Route path="/phase4_2/step/2/remedial/c1/taskG" element={<Phase4_2Step2RemedialC1TaskG />} />
          <Route path="/app/phase4_2/step/2/remedial/c1/taskG" element={<Phase4_2Step2RemedialC1TaskG />} />
          <Route path="/phase4_2/step/2/remedial/c1/taskH" element={<Phase4_2Step2RemedialC1TaskH />} />
          <Route path="/app/phase4_2/step/2/remedial/c1/taskH" element={<Phase4_2Step2RemedialC1TaskH />} />
          <Route path="/phase4_2/step/2/remedial/c1/results" element={<Phase4_2Step2RemedialC1Results />} />
          <Route path="/app/phase4_2/step/2/remedial/c1/results" element={<Phase4_2Step2RemedialC1Results />} />

          {/* Phase 4.2 Step 3 Remedial A2 Routes */}
          <Route path="/phase4_2/step/3/remedial/a2/taskA" element={<Phase4_2Step3RemedialA2TaskA />} />
          <Route path="/app/phase4_2/step/3/remedial/a2/taskA" element={<Phase4_2Step3RemedialA2TaskA />} />
          <Route path="/phase4_2/step/3/remedial/a2/taskB" element={<Phase4_2Step3RemedialA2TaskB />} />
          <Route path="/app/phase4_2/step/3/remedial/a2/taskB" element={<Phase4_2Step3RemedialA2TaskB />} />
          <Route path="/phase4_2/step/3/remedial/a2/taskC" element={<Phase4_2Step3RemedialA2TaskC />} />
          <Route path="/app/phase4_2/step/3/remedial/a2/taskC" element={<Phase4_2Step3RemedialA2TaskC />} />
          <Route path="/phase4_2/step/3/remedial/a2/results" element={<Phase4_2Step3RemedialA2Results />} />
          <Route path="/app/phase4_2/step/3/remedial/a2/results" element={<Phase4_2Step3RemedialA2Results />} />

          {/* Phase 4.2 Step 3 Remedial B1 Routes */}
          <Route path="/phase4_2/step/3/remedial/b1/taskA" element={<Phase4_2Step3RemedialB1TaskA />} />
          <Route path="/app/phase4_2/step/3/remedial/b1/taskA" element={<Phase4_2Step3RemedialB1TaskA />} />
          <Route path="/phase4_2/step/3/remedial/b1/taskB" element={<Phase4_2Step3RemedialB1TaskB />} />
          <Route path="/app/phase4_2/step/3/remedial/b1/taskB" element={<Phase4_2Step3RemedialB1TaskB />} />
          <Route path="/phase4_2/step/3/remedial/b1/taskC" element={<Phase4_2Step3RemedialB1TaskC />} />
          <Route path="/app/phase4_2/step/3/remedial/b1/taskC" element={<Phase4_2Step3RemedialB1TaskC />} />
          <Route path="/phase4_2/step/3/remedial/b1/taskD" element={<Phase4_2Step3RemedialB1TaskD />} />
          <Route path="/app/phase4_2/step/3/remedial/b1/taskD" element={<Phase4_2Step3RemedialB1TaskD />} />
          <Route path="/phase4_2/step/3/remedial/b1/results" element={<Phase4_2Step3RemedialB1Results />} />
          <Route path="/app/phase4_2/step/3/remedial/b1/results" element={<Phase4_2Step3RemedialB1Results />} />

          {/* Phase 4.2 Step 3 Remedial B2 Routes */}
          <Route path="/phase4_2/step/3/remedial/b2/taskA" element={<Phase4_2Step3RemedialB2TaskA />} />
          <Route path="/app/phase4_2/step/3/remedial/b2/taskA" element={<Phase4_2Step3RemedialB2TaskA />} />
          <Route path="/phase4_2/step/3/remedial/b2/taskB" element={<Phase4_2Step3RemedialB2TaskB />} />
          <Route path="/app/phase4_2/step/3/remedial/b2/taskB" element={<Phase4_2Step3RemedialB2TaskB />} />
          <Route path="/phase4_2/step/3/remedial/b2/taskC" element={<Phase4_2Step3RemedialB2TaskC />} />
          <Route path="/app/phase4_2/step/3/remedial/b2/taskC" element={<Phase4_2Step3RemedialB2TaskC />} />
          <Route path="/phase4_2/step/3/remedial/b2/taskD" element={<Phase4_2Step3RemedialB2TaskD />} />
          <Route path="/app/phase4_2/step/3/remedial/b2/taskD" element={<Phase4_2Step3RemedialB2TaskD />} />
          <Route path="/phase4_2/step/3/remedial/b2/results" element={<Phase4_2Step3RemedialB2Results />} />
          <Route path="/app/phase4_2/step/3/remedial/b2/results" element={<Phase4_2Step3RemedialB2Results />} />

          {/* Phase 4.2 Step 3 Remedial C1 Routes */}
          <Route path="/phase4_2/step/3/remedial/c1/taskA" element={<Phase4_2Step3RemedialC1TaskA />} />
          <Route path="/app/phase4_2/step/3/remedial/c1/taskA" element={<Phase4_2Step3RemedialC1TaskA />} />
          <Route path="/phase4_2/step/3/remedial/c1/taskB" element={<Phase4_2Step3RemedialC1TaskB />} />
          <Route path="/app/phase4_2/step/3/remedial/c1/taskB" element={<Phase4_2Step3RemedialC1TaskB />} />
          <Route path="/phase4_2/step/3/remedial/c1/taskC" element={<Phase4_2Step3RemedialC1TaskC />} />
          <Route path="/app/phase4_2/step/3/remedial/c1/taskC" element={<Phase4_2Step3RemedialC1TaskC />} />
          <Route path="/phase4_2/step/3/remedial/c1/taskD" element={<Phase4_2Step3RemedialC1TaskD />} />
          <Route path="/app/phase4_2/step/3/remedial/c1/taskD" element={<Phase4_2Step3RemedialC1TaskD />} />
          <Route path="/phase4_2/step/3/remedial/c1/taskE" element={<Phase4_2Step3RemedialC1TaskE />} />
          <Route path="/app/phase4_2/step/3/remedial/c1/taskE" element={<Phase4_2Step3RemedialC1TaskE />} />
          <Route path="/phase4_2/step/3/remedial/c1/taskF" element={<Phase4_2Step3RemedialC1TaskF />} />
          <Route path="/app/phase4_2/step/3/remedial/c1/taskF" element={<Phase4_2Step3RemedialC1TaskF />} />
          <Route path="/phase4_2/step/3/remedial/c1/taskG" element={<Phase4_2Step3RemedialC1TaskG />} />
          <Route path="/app/phase4_2/step/3/remedial/c1/taskG" element={<Phase4_2Step3RemedialC1TaskG />} />
          <Route path="/phase4_2/step/3/remedial/c1/taskH" element={<Phase4_2Step3RemedialC1TaskH />} />
          <Route path="/app/phase4_2/step/3/remedial/c1/taskH" element={<Phase4_2Step3RemedialC1TaskH />} />
          <Route path="/phase4_2/step/3/remedial/c1/results" element={<Phase4_2Step3RemedialC1Results />} />
          <Route path="/app/phase4_2/step/3/remedial/c1/results" element={<Phase4_2Step3RemedialC1Results />} />

          {/* Phase 4.2 Step 4 Remedial A2 Routes */}
          <Route path="/phase4_2/step/4/remedial/a2/taskA" element={<Phase4_2Step4RemedialA2TaskA />} />
          <Route path="/app/phase4_2/step/4/remedial/a2/taskA" element={<Phase4_2Step4RemedialA2TaskA />} />
          <Route path="/phase4_2/step/4/remedial/a2/taskB" element={<Phase4_2Step4RemedialA2TaskB />} />
          <Route path="/app/phase4_2/step/4/remedial/a2/taskB" element={<Phase4_2Step4RemedialA2TaskB />} />
          <Route path="/phase4_2/step/4/remedial/a2/taskC" element={<Phase4_2Step4RemedialA2TaskC />} />
          <Route path="/app/phase4_2/step/4/remedial/a2/taskC" element={<Phase4_2Step4RemedialA2TaskC />} />
          <Route path="/phase4_2/step/4/remedial/a2/results" element={<Phase4_2Step4RemedialA2Results />} />
          <Route path="/app/phase4_2/step/4/remedial/a2/results" element={<Phase4_2Step4RemedialA2Results />} />

          {/* Phase 4.2 Step 4 Remedial B1 Routes */}
          <Route path="/phase4_2/step/4/remedial/b1/taskA" element={<Phase4_2Step4RemedialB1TaskA />} />
          <Route path="/app/phase4_2/step/4/remedial/b1/taskA" element={<Phase4_2Step4RemedialB1TaskA />} />
          <Route path="/phase4_2/step/4/remedial/b1/taskB" element={<Phase4_2Step4RemedialB1TaskB />} />
          <Route path="/app/phase4_2/step/4/remedial/b1/taskB" element={<Phase4_2Step4RemedialB1TaskB />} />
          <Route path="/phase4_2/step/4/remedial/b1/taskC" element={<Phase4_2Step4RemedialB1TaskC />} />
          <Route path="/app/phase4_2/step/4/remedial/b1/taskC" element={<Phase4_2Step4RemedialB1TaskC />} />
          <Route path="/phase4_2/step/4/remedial/b1/results" element={<Phase4_2Step4RemedialB1Results />} />
          <Route path="/app/phase4_2/step/4/remedial/b1/results" element={<Phase4_2Step4RemedialB1Results />} />

          {/* Phase 4.2 Step 4 Remedial B2 Routes */}
          <Route path="/phase4_2/step/4/remedial/b2/taskA" element={<Phase4_2Step4RemedialB2TaskA />} />
          <Route path="/app/phase4_2/step/4/remedial/b2/taskA" element={<Phase4_2Step4RemedialB2TaskA />} />
          <Route path="/phase4_2/step/4/remedial/b2/taskB" element={<Phase4_2Step4RemedialB2TaskB />} />
          <Route path="/app/phase4_2/step/4/remedial/b2/taskB" element={<Phase4_2Step4RemedialB2TaskB />} />
          <Route path="/phase4_2/step/4/remedial/b2/taskC" element={<Phase4_2Step4RemedialB2TaskC />} />
          <Route path="/app/phase4_2/step/4/remedial/b2/taskC" element={<Phase4_2Step4RemedialB2TaskC />} />
          <Route path="/phase4_2/step/4/remedial/b2/taskD" element={<Phase4_2Step4RemedialB2TaskD />} />
          <Route path="/app/phase4_2/step/4/remedial/b2/taskD" element={<Phase4_2Step4RemedialB2TaskD />} />
          <Route path="/phase4_2/step/4/remedial/b2/results" element={<Phase4_2Step4RemedialB2Results />} />
          <Route path="/app/phase4_2/step/4/remedial/b2/results" element={<Phase4_2Step4RemedialB2Results />} />

          {/* Phase 4.2 Step 4 Remedial C1 Routes */}
          <Route path="/phase4_2/step/4/remedial/c1/taskA" element={<Phase4_2Step4RemedialC1TaskA />} />
          <Route path="/app/phase4_2/step/4/remedial/c1/taskA" element={<Phase4_2Step4RemedialC1TaskA />} />
          <Route path="/phase4_2/step/4/remedial/c1/taskB" element={<Phase4_2Step4RemedialC1TaskB />} />
          <Route path="/app/phase4_2/step/4/remedial/c1/taskB" element={<Phase4_2Step4RemedialC1TaskB />} />
          <Route path="/phase4_2/step/4/remedial/c1/taskC" element={<Phase4_2Step4RemedialC1TaskC />} />
          <Route path="/app/phase4_2/step/4/remedial/c1/taskC" element={<Phase4_2Step4RemedialC1TaskC />} />
          <Route path="/phase4_2/step/4/remedial/c1/taskD" element={<Phase4_2Step4RemedialC1TaskD />} />
          <Route path="/app/phase4_2/step/4/remedial/c1/taskD" element={<Phase4_2Step4RemedialC1TaskD />} />
          <Route path="/phase4_2/step/4/remedial/c1/taskE" element={<Phase4_2Step4RemedialC1TaskE />} />
          <Route path="/app/phase4_2/step/4/remedial/c1/taskE" element={<Phase4_2Step4RemedialC1TaskE />} />
          <Route path="/phase4_2/step/4/remedial/c1/taskF" element={<Phase4_2Step4RemedialC1TaskF />} />
          <Route path="/app/phase4_2/step/4/remedial/c1/taskF" element={<Phase4_2Step4RemedialC1TaskF />} />
          <Route path="/phase4_2/step/4/remedial/c1/taskG" element={<Phase4_2Step4RemedialC1TaskG />} />
          <Route path="/app/phase4_2/step/4/remedial/c1/taskG" element={<Phase4_2Step4RemedialC1TaskG />} />
          <Route path="/phase4_2/step/4/remedial/c1/taskH" element={<Phase4_2Step4RemedialC1TaskH />} />
          <Route path="/app/phase4_2/step/4/remedial/c1/taskH" element={<Phase4_2Step4RemedialC1TaskH />} />
          <Route path="/phase4_2/step/4/remedial/c1/results" element={<Phase4_2Step4RemedialC1Results />} />
          <Route path="/app/phase4_2/step/4/remedial/c1/results" element={<Phase4_2Step4RemedialC1Results />} />

          {/* Phase 4.2 Step 5 Remedial A2 Routes */}
          <Route path="/phase4_2/step/5/remedial/a2/taska" element={<Phase4_2Step5RemedialA2TaskA />} />
          <Route path="/app/phase4_2/step/5/remedial/a2/taska" element={<Phase4_2Step5RemedialA2TaskA />} />
          <Route path="/phase4_2/step/5/remedial/a2/taskb" element={<Phase4_2Step5RemedialA2TaskB />} />
          <Route path="/app/phase4_2/step/5/remedial/a2/taskb" element={<Phase4_2Step5RemedialA2TaskB />} />
          <Route path="/phase4_2/step/5/remedial/a2/taskc" element={<Phase4_2Step5RemedialA2TaskC />} />
          <Route path="/app/phase4_2/step/5/remedial/a2/taskc" element={<Phase4_2Step5RemedialA2TaskC />} />
          <Route path="/phase4_2/step/5/remedial/a2/results" element={<Phase4_2Step5RemedialA2Results />} />
          <Route path="/app/phase4_2/step/5/remedial/a2/results" element={<Phase4_2Step5RemedialA2Results />} />

          {/* Phase 4.2 Step 5 Remedial B1 Routes */}
          <Route path="/phase4_2/step/5/remedial/b1/taska" element={<Phase4_2Step5RemedialB1TaskA />} />
          <Route path="/app/phase4_2/step/5/remedial/b1/taska" element={<Phase4_2Step5RemedialB1TaskA />} />
          <Route path="/phase4_2/step/5/remedial/b1/taskb" element={<Phase4_2Step5RemedialB1TaskB />} />
          <Route path="/app/phase4_2/step/5/remedial/b1/taskb" element={<Phase4_2Step5RemedialB1TaskB />} />
          <Route path="/phase4_2/step/5/remedial/b1/taskc" element={<Phase4_2Step5RemedialB1TaskC />} />
          <Route path="/app/phase4_2/step/5/remedial/b1/taskc" element={<Phase4_2Step5RemedialB1TaskC />} />
          <Route path="/phase4_2/step/5/remedial/b1/taskd" element={<Phase4_2Step5RemedialB1TaskD />} />
          <Route path="/app/phase4_2/step/5/remedial/b1/taskd" element={<Phase4_2Step5RemedialB1TaskD />} />
          <Route path="/phase4_2/step/5/remedial/b1/results" element={<Phase4_2Step5RemedialB1Results />} />
          <Route path="/app/phase4_2/step/5/remedial/b1/results" element={<Phase4_2Step5RemedialB1Results />} />

          {/* Phase 4.2 Step 5 Remedial B2 Routes */}
          <Route path="/phase4_2/step/5/remedial/b2/taska" element={<Phase4_2Step5RemedialB2TaskA />} />
          <Route path="/app/phase4_2/step/5/remedial/b2/taska" element={<Phase4_2Step5RemedialB2TaskA />} />
          <Route path="/phase4_2/step/5/remedial/b2/taskb" element={<Phase4_2Step5RemedialB2TaskB />} />
          <Route path="/app/phase4_2/step/5/remedial/b2/taskb" element={<Phase4_2Step5RemedialB2TaskB />} />
          <Route path="/phase4_2/step/5/remedial/b2/taskc" element={<Phase4_2Step5RemedialB2TaskC />} />
          <Route path="/app/phase4_2/step/5/remedial/b2/taskc" element={<Phase4_2Step5RemedialB2TaskC />} />
          <Route path="/phase4_2/step/5/remedial/b2/taskd" element={<Phase4_2Step5RemedialB2TaskD />} />
          <Route path="/app/phase4_2/step/5/remedial/b2/taskd" element={<Phase4_2Step5RemedialB2TaskD />} />
          <Route path="/phase4_2/step/5/remedial/b2/results" element={<Phase4_2Step5RemedialB2Results />} />
          <Route path="/app/phase4_2/step/5/remedial/b2/results" element={<Phase4_2Step5RemedialB2Results />} />

          {/* Phase 4.2 Step 5 Remedial C1 Routes */}
          <Route path="/phase4_2/step/5/remedial/c1/taska" element={<Phase4_2Step5RemedialC1TaskA />} />
          <Route path="/app/phase4_2/step/5/remedial/c1/taska" element={<Phase4_2Step5RemedialC1TaskA />} />
          <Route path="/phase4_2/step/5/remedial/c1/taskb" element={<Phase4_2Step5RemedialC1TaskB />} />
          <Route path="/app/phase4_2/step/5/remedial/c1/taskb" element={<Phase4_2Step5RemedialC1TaskB />} />
          <Route path="/phase4_2/step/5/remedial/c1/taskc" element={<Phase4_2Step5RemedialC1TaskC />} />
          <Route path="/app/phase4_2/step/5/remedial/c1/taskc" element={<Phase4_2Step5RemedialC1TaskC />} />
          <Route path="/phase4_2/step/5/remedial/c1/taskd" element={<Phase4_2Step5RemedialC1TaskD />} />
          <Route path="/app/phase4_2/step/5/remedial/c1/taskd" element={<Phase4_2Step5RemedialC1TaskD />} />
          <Route path="/phase4_2/step/5/remedial/c1/results" element={<Phase4_2Step5RemedialC1Results />} />
          <Route path="/app/phase4_2/step/5/remedial/c1/results" element={<Phase4_2Step5RemedialC1Results />} />

          {/* Phase 4 Step 4 Remedial A1 Routes */}
          <Route path="/phase4/step/4/remedial/a1/taskA" element={<Phase4Step4RemedialA1TaskA />} />
          <Route path="/phase4/step/4/remedial/a1/taskB" element={<Phase4Step4RemedialA1TaskB />} />
          <Route path="/phase4/step/4/remedial/a1/taskC" element={<Phase4Step4RemedialA1TaskC />} />

          {/* Phase 4 Step 4 Remedial A2 Routes */}
          <Route path="/phase4/step/4/remedial/a2/taskA" element={<Phase4Step4RemedialA2TaskA />} />
          <Route path="/phase4/step/4/remedial/a2/taskB" element={<Phase4Step4RemedialA2TaskB />} />
          <Route path="/phase4/step/4/remedial/a2/taskC" element={<Phase4Step4RemedialA2TaskC />} />

          {/* Phase 4 Step 4 Remedial B1 Routes */}
          <Route path="/phase4/step/4/remedial/b1/taskA" element={<Phase4Step4RemedialB1TaskA />} />
          <Route path="/phase4/step/4/remedial/b1/taskB" element={<Phase4Step4RemedialB1TaskB />} />
          <Route path="/phase4/step/4/remedial/b1/taskC" element={<Phase4Step4RemedialB1TaskC />} />
          <Route path="/phase4/step/4/remedial/b1/taskD" element={<Phase4Step4RemedialB1TaskD />} />
          <Route path="/phase4/step/4/remedial/b1/taskE" element={<Phase4Step4RemedialB1TaskE />} />
          <Route path="/phase4/step/4/remedial/b1/taskF" element={<Phase4Step4RemedialB1TaskF />} />
          <Route path="/phase4/step/4/remedial/b1/results" element={<Phase4Step4RemedialB1Results />} />

          {/* Phase 4 Step 4 Remedial B2 Routes */}
          <Route path="/phase4/step/4/remedial/b2/taskA" element={<Phase4Step4RemedialB2TaskA />} />
          <Route path="/phase4/step/4/remedial/b2/taskB" element={<Phase4Step4RemedialB2TaskB />} />
          <Route path="/phase4/step/4/remedial/b2/taskC" element={<Phase4Step4RemedialB2TaskC />} />
          <Route path="/phase4/step/4/remedial/b2/taskD" element={<Phase4Step4RemedialB2TaskD />} />
          <Route path="/phase4/step/4/remedial/b2/results" element={<Phase4Step4RemedialB2Results />} />

          {/* Phase 4 Step 4 Remedial C1 Routes */}
          <Route path="/phase4/step/4/remedial/c1/taskA" element={<Phase4Step4RemedialC1TaskA />} />
          <Route path="/phase4/step/4/remedial/c1/taskB" element={<Phase4Step4RemedialC1TaskB />} />
          <Route path="/phase4/step/4/remedial/c1/taskC" element={<Phase4Step4RemedialC1TaskC />} />
          <Route path="/phase4/step/4/remedial/c1/taskD" element={<Phase4Step4RemedialC1TaskD />} />
          <Route path="/phase4/step/4/remedial/c1/results" element={<Phase4Step4RemedialC1Results />} />

          {/* Phase 4 Remedial Routes */}
          <Route path="/phase4/remedial/a1/taskA" element={<RemedialA1TaskA />} />
          <Route path="/phase4/remedial/a1/taskB" element={<RemedialA1TaskB />} />
          <Route path="/phase4/remedial/a2/taskA" element={<RemedialA2TaskA />} />
          <Route path="/phase4/remedial/a2/taskB" element={<RemedialA2TaskB />} />
          <Route path="/phase4/remedial/b1/taskA" element={<RemedialB1TaskA />} />
          <Route path="/phase4/remedial/b1/taskB" element={<RemedialB1TaskB />} />
          <Route path="/phase4/remedial/b1/taskC" element={<RemedialB1TaskC />} />
          <Route path="/phase4/remedial/b1/taskD" element={<RemedialB1TaskD />} />
          <Route path="/phase4/remedial/b2/taskA" element={<RemedialB2TaskA />} />
          <Route path="/phase4/remedial/b2/taskB" element={<RemedialB2TaskB />} />
          <Route path="/phase4/remedial/b2/taskC" element={<RemedialB2TaskC />} />
          <Route path="/phase4/remedial/b2/taskD" element={<RemedialB2TaskD />} />
          <Route path="/phase4/remedial/c1/taskA" element={<RemedialC1TaskA />} />
          <Route path="/phase4/remedial/c1/taskB" element={<RemedialC1TaskB />} />
          <Route path="/phase4/remedial/c1/taskC" element={<RemedialC1TaskC />} />
          <Route path="/phase4/remedial/c1/taskD" element={<RemedialC1TaskD />} />

          {/* Phase 4 Step 3 Remedial Routes */}
          <Route path="/phase4/step3/remedial/a1/taskA" element={<RemedialStep3A1TaskA />} />
          <Route path="/phase4/step3/remedial/a1/taskB" element={<RemedialStep3A1TaskB />} />
          <Route path="/phase4/step3/remedial/a1/taskC" element={<RemedialStep3A1TaskC />} />

          <Route path="/phase4/step3/remedial/a2/taskA" element={<RemedialStep3A2TaskA />} />
          <Route path="/phase4/step3/remedial/a2/taskB" element={<RemedialStep3A2TaskB />} />
          <Route path="/phase4/step3/remedial/a2/taskC" element={<RemedialStep3A2TaskC />} />

          <Route path="/phase4/step3/remedial/b1/taskA" element={<RemedialStep3B1TaskA />} />
          <Route path="/phase4/step3/remedial/b1/taskB" element={<RemedialStep3B1TaskB />} />
          <Route path="/phase4/step3/remedial/b1/taskC" element={<RemedialStep3B1TaskC />} />
          <Route path="/phase4/step3/remedial/b1/taskD" element={<RemedialStep3B1TaskD />} />
          <Route path="/phase4/step3/remedial/b1/taskE" element={<RemedialStep3B1TaskE />} />
          <Route path="/phase4/step3/remedial/b1/taskF" element={<RemedialStep3B1TaskF />} />
          <Route path="/phase4/step3/remedial/b1/results" element={<RemedialStep3B1Results />} />

          <Route path="/phase4/step3/remedial/b2/taskA" element={<RemedialStep3B2TaskA />} />
          <Route path="/phase4/step3/remedial/b2/taskB" element={<RemedialStep3B2TaskB />} />
          <Route path="/phase4/step3/remedial/b2/taskC" element={<RemedialStep3B2TaskC />} />
          <Route path="/phase4/step3/remedial/b2/taskD" element={<RemedialStep3B2TaskD />} />
          <Route path="/phase4/step3/remedial/b2/taskE" element={<RemedialStep3B2TaskE />} />
          <Route path="/phase4/step3/remedial/b2/taskF" element={<RemedialStep3B2TaskF />} />
          <Route path="/phase4/step3/remedial/b2/results" element={<RemedialStep3B2Results />} />

          <Route path="/phase4/step3/remedial/c1/taskA" element={<RemedialStep3C1TaskA />} />
          <Route path="/phase4/step3/remedial/c1/taskB" element={<RemedialStep3C1TaskB />} />
          <Route path="/phase4/step3/remedial/c1/taskC" element={<RemedialStep3C1TaskC />} />
          <Route path="/phase4/step3/remedial/c1/taskD" element={<RemedialStep3C1TaskD />} />
          <Route path="/phase4/step3/remedial/c1/taskE" element={<RemedialStep3C1TaskE />} />
          <Route path="/phase4/step3/remedial/c1/taskF" element={<RemedialStep3C1TaskF />} />
          <Route path="/phase4/step3/remedial/c1/taskG" element={<RemedialStep3C1TaskG />} />
          <Route path="/phase4/step3/remedial/c1/taskH" element={<RemedialStep3C1TaskH />} />

          {/* Phase 5 Routes */}
          <Route path="/phase5/subphase/1/step/1" element={<Phase5Step1Intro />} />
          <Route path="/phase5/subphase/1/step/1/interaction/1" element={<Phase5Step1Interaction1 />} />
          <Route path="/phase5/subphase/1/step/1/interaction/2" element={<Phase5Step1Interaction2 />} />
          <Route path="/phase5/subphase/1/step/1/interaction/3" element={<Phase5Step1Interaction3 />} />
          <Route path="/phase5/subphase/1/step/1/score" element={<Phase5Step1ScoreCalculation />} />

          {/* Phase 5 Step 1 Remedial Routes */}
          {/* A1 Remedial */}
          <Route path="/phase5/subphase/1/step/1/remedial/a1/task/a" element={<Phase5Step1RemedialA1TaskA />} />
          <Route path="/phase5/subphase/1/step/1/remedial/a1/task/b" element={<Phase5Step1RemedialA1TaskB />} />
          <Route path="/phase5/subphase/1/step/1/remedial/a1/task/c" element={<Phase5Step1RemedialA1TaskC />} />
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/1/step/1/remedial/a2/task/a" element={<Phase5Step1RemedialA2TaskA />} />
          <Route path="/phase5/subphase/1/step/1/remedial/a2/task/b" element={<Phase5Step1RemedialA2TaskB />} />
          <Route path="/phase5/subphase/1/step/1/remedial/a2/task/c" element={<Phase5Step1RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/1/step/1/remedial/b1/task/a" element={<Phase5Step1RemedialB1TaskA />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b1/task/b" element={<Phase5Step1RemedialB1TaskB />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b1/task/c" element={<Phase5Step1RemedialB1TaskC />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b1/task/d" element={<Phase5Step1RemedialB1TaskD />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b1/task/e" element={<Phase5Step1RemedialB1TaskE />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b1/task/f" element={<Phase5Step1RemedialB1TaskF />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b1/results" element={<Phase5Step1RemedialB1Results />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/1/step/1/remedial/b2/task/a" element={<Phase5Step1RemedialB2TaskA />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b2/task/b" element={<Phase5Step1RemedialB2TaskB />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b2/task/c" element={<Phase5Step1RemedialB2TaskC />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b2/task/d" element={<Phase5Step1RemedialB2TaskD />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b2/task/e" element={<Phase5Step1RemedialB2TaskE />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b2/task/f" element={<Phase5Step1RemedialB2TaskF />} />
          <Route path="/phase5/subphase/1/step/1/remedial/b2/results" element={<Phase5Step1RemedialB2Results />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/1/step/1/remedial/c1/task/a" element={<Phase5Step1RemedialC1TaskA />} />
          <Route path="/phase5/subphase/1/step/1/remedial/c1/task/b" element={<Phase5Step1RemedialC1TaskB />} />
          <Route path="/phase5/subphase/1/step/1/remedial/c1/task/c" element={<Phase5Step1RemedialC1TaskC />} />
          <Route path="/phase5/subphase/1/step/1/remedial/c1/task/d" element={<Phase5Step1RemedialC1TaskD />} />
          <Route path="/phase5/subphase/1/step/1/remedial/c1/task/e" element={<Phase5Step1RemedialC1TaskE />} />
          <Route path="/phase5/subphase/1/step/1/remedial/c1/task/f" element={<Phase5Step1RemedialC1TaskF />} />
          <Route path="/phase5/subphase/1/step/1/remedial/c1/task/g" element={<Phase5Step1RemedialC1TaskG />} />
          <Route path="/phase5/subphase/1/step/1/remedial/c1/task/h" element={<Phase5Step1RemedialC1TaskH />} />

          {/* Phase 5 Step 2 Routes */}
          <Route path="/phase5/subphase/1/step/2" element={<Phase5Step2Intro />} />
          <Route path="/phase5/subphase/1/step/2/interaction/1" element={<Phase5Step2Interaction1 />} />
          <Route path="/phase5/subphase/1/step/2/interaction/2" element={<Phase5Step2Interaction2 />} />
          <Route path="/phase5/subphase/1/step/2/interaction/3" element={<Phase5Step2Interaction3 />} />
          <Route path="/phase5/subphase/1/step/2/score" element={<Phase5Step2ScoreCalculation />} />

          {/* Phase 5 Step 2 Remedial Routes */}
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/1/step/2/remedial/a2/task/a" element={<Phase5Step2RemedialA2TaskA />} />
          <Route path="/phase5/subphase/1/step/2/remedial/a2/task/b" element={<Phase5Step2RemedialA2TaskB />} />
          <Route path="/phase5/subphase/1/step/2/remedial/a2/task/c" element={<Phase5Step2RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/1/step/2/remedial/b1/task/a" element={<Phase5Step2RemedialB1TaskA />} />
          <Route path="/phase5/subphase/1/step/2/remedial/b1/task/b" element={<Phase5Step2RemedialB1TaskB />} />
          <Route path="/phase5/subphase/1/step/2/remedial/b1/task/c" element={<Phase5Step2RemedialB1TaskC />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/1/step/2/remedial/b2/task/a" element={<Phase5Step2RemedialB2TaskA />} />
          <Route path="/phase5/subphase/1/step/2/remedial/b2/task/b" element={<Phase5Step2RemedialB2TaskB />} />
          <Route path="/phase5/subphase/1/step/2/remedial/b2/task/c" element={<Phase5Step2RemedialB2TaskC />} />
          <Route path="/phase5/subphase/1/step/2/remedial/b2/task/d" element={<Phase5Step2RemedialB2TaskD />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/1/step/2/remedial/c1/task/a" element={<Phase5Step2RemedialC1TaskA />} />
          <Route path="/phase5/subphase/1/step/2/remedial/c1/task/b" element={<Phase5Step2RemedialC1TaskB />} />
          <Route path="/phase5/subphase/1/step/2/remedial/c1/task/c" element={<Phase5Step2RemedialC1TaskC />} />
          <Route path="/phase5/subphase/1/step/2/remedial/c1/task/d" element={<Phase5Step2RemedialC1TaskD />} />

          {/* Phase 5 Step 3 Routes */}
          <Route path="/phase5/subphase/1/step/3" element={<Phase5Step3Intro />} />
          <Route path="/phase5/subphase/1/step/3/interaction/1" element={<Phase5Step3Interaction1 />} />
          <Route path="/phase5/subphase/1/step/3/interaction/2" element={<Phase5Step3Interaction2 />} />
          <Route path="/phase5/subphase/1/step/3/interaction/3" element={<Phase5Step3Interaction3 />} />
          <Route path="/phase5/subphase/1/step/3/score" element={<Phase5Step3ScoreCalculation />} />

          {/* Phase 5 Step 3 Remedial Routes */}
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/1/step/3/remedial/a2/task/a" element={<Phase5Step3RemedialA2TaskA />} />
          <Route path="/phase5/subphase/1/step/3/remedial/a2/task/b" element={<Phase5Step3RemedialA2TaskB />} />
          <Route path="/phase5/subphase/1/step/3/remedial/a2/task/c" element={<Phase5Step3RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/1/step/3/remedial/b1/task/a" element={<Phase5Step3RemedialB1TaskA />} />
          <Route path="/phase5/subphase/1/step/3/remedial/b1/task/b" element={<Phase5Step3RemedialB1TaskB />} />
          <Route path="/phase5/subphase/1/step/3/remedial/b1/task/c" element={<Phase5Step3RemedialB1TaskC />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/1/step/3/remedial/b2/task/a" element={<Phase5Step3RemedialB2TaskA />} />
          <Route path="/phase5/subphase/1/step/3/remedial/b2/task/b" element={<Phase5Step3RemedialB2TaskB />} />
          <Route path="/phase5/subphase/1/step/3/remedial/b2/task/c" element={<Phase5Step3RemedialB2TaskC />} />
          <Route path="/phase5/subphase/1/step/3/remedial/b2/task/d" element={<Phase5Step3RemedialB2TaskD />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/1/step/3/remedial/c1/task/a" element={<Phase5Step3RemedialC1TaskA />} />
          <Route path="/phase5/subphase/1/step/3/remedial/c1/task/b" element={<Phase5Step3RemedialC1TaskB />} />
          <Route path="/phase5/subphase/1/step/3/remedial/c1/task/c" element={<Phase5Step3RemedialC1TaskC />} />
          <Route path="/phase5/subphase/1/step/3/remedial/c1/task/d" element={<Phase5Step3RemedialC1TaskD />} />

          {/* Phase 5 Step 4 Routes */}
          <Route path="/phase5/subphase/1/step/4" element={<Phase5Step4Intro />} />
          <Route path="/phase5/subphase/1/step/4/interaction/1" element={<Phase5Step4Interaction1 />} />
          <Route path="/phase5/subphase/1/step/4/interaction/2" element={<Phase5Step4Interaction2 />} />
          <Route path="/phase5/subphase/1/step/4/interaction/3" element={<Phase5Step4Interaction3 />} />
          <Route path="/phase5/subphase/1/step/4/score" element={<Phase5Step4ScoreCalculation />} />

          {/* Phase 5 Step 4 Remedial Routes */}
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/1/step/4/remedial/a2/task/a" element={<Phase5Step4RemedialA2TaskA />} />
          <Route path="/phase5/subphase/1/step/4/remedial/a2/task/b" element={<Phase5Step4RemedialA2TaskB />} />
          <Route path="/phase5/subphase/1/step/4/remedial/a2/task/c" element={<Phase5Step4RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/1/step/4/remedial/b1/task/a" element={<Phase5Step4RemedialB1TaskA />} />
          <Route path="/phase5/subphase/1/step/4/remedial/b1/task/b" element={<Phase5Step4RemedialB1TaskB />} />
          <Route path="/phase5/subphase/1/step/4/remedial/b1/task/c" element={<Phase5Step4RemedialB1TaskC />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/1/step/4/remedial/b2/task/a" element={<Phase5Step4RemedialB2TaskA />} />
          <Route path="/phase5/subphase/1/step/4/remedial/b2/task/b" element={<Phase5Step4RemedialB2TaskB />} />
          <Route path="/phase5/subphase/1/step/4/remedial/b2/task/c" element={<Phase5Step4RemedialB2TaskC />} />
          <Route path="/phase5/subphase/1/step/4/remedial/b2/task/d" element={<Phase5Step4RemedialB2TaskD />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/1/step/4/remedial/c1/task/a" element={<Phase5Step4RemedialC1TaskA />} />
          <Route path="/phase5/subphase/1/step/4/remedial/c1/task/b" element={<Phase5Step4RemedialC1TaskB />} />
          <Route path="/phase5/subphase/1/step/4/remedial/c1/task/c" element={<Phase5Step4RemedialC1TaskC />} />
          <Route path="/phase5/subphase/1/step/4/remedial/c1/task/d" element={<Phase5Step4RemedialC1TaskD />} />

          {/* Phase 5 Step 5 Routes */}
          <Route path="/phase5/subphase/1/step/5" element={<Phase5Step5Intro />} />
          <Route path="/phase5/subphase/1/step/5/interaction/1" element={<Phase5Step5Interaction1 />} />
          <Route path="/phase5/subphase/1/step/5/interaction/2" element={<Phase5Step5Interaction2 />} />
          <Route path="/phase5/subphase/1/step/5/interaction/3" element={<Phase5Step5Interaction3 />} />
          <Route path="/phase5/subphase/1/step/5/score" element={<Phase5Step5ScoreCalculation />} />

          {/* Phase 5 Step 5 Remedial Routes */}
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/1/step/5/remedial/a2/task/a" element={<Phase5Step5RemedialA2TaskA />} />
          <Route path="/phase5/subphase/1/step/5/remedial/a2/task/b" element={<Phase5Step5RemedialA2TaskB />} />
          <Route path="/phase5/subphase/1/step/5/remedial/a2/task/c" element={<Phase5Step5RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/1/step/5/remedial/b1/task/a" element={<Phase5Step5RemedialB1TaskA />} />
          <Route path="/phase5/subphase/1/step/5/remedial/b1/task/b" element={<Phase5Step5RemedialB1TaskB />} />
          <Route path="/phase5/subphase/1/step/5/remedial/b1/task/c" element={<Phase5Step5RemedialB1TaskC />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/1/step/5/remedial/b2/task/a" element={<Phase5Step5RemedialB2TaskA />} />
          <Route path="/phase5/subphase/1/step/5/remedial/b2/task/b" element={<Phase5Step5RemedialB2TaskB />} />
          <Route path="/phase5/subphase/1/step/5/remedial/b2/task/c" element={<Phase5Step5RemedialB2TaskC />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/1/step/5/remedial/c1/task/a" element={<Phase5Step5RemedialC1TaskA />} />
          <Route path="/phase5/subphase/1/step/5/remedial/c1/task/b" element={<Phase5Step5RemedialC1TaskB />} />
          <Route path="/phase5/subphase/1/step/5/remedial/c1/task/c" element={<Phase5Step5RemedialC1TaskC />} />
          <Route path="/phase5/subphase/1/step/5/remedial/c1/task/d" element={<Phase5Step5RemedialC1TaskD />} />

          {/* Phase 5 SubPhase 2 Routes */}
          {/* Phase 5 SubPhase 2 Step 1 Routes */}
          <Route path="/phase5/subphase/2/step/1" element={<Phase5SubPhase2Step1Intro />} />
          <Route path="/phase5/subphase/2/step/1/interaction/1" element={<Phase5SubPhase2Step1Interaction1 />} />
          <Route path="/phase5/subphase/2/step/1/interaction/2" element={<Phase5SubPhase2Step1Interaction2 />} />
          <Route path="/phase5/subphase/2/step/1/interaction/3" element={<Phase5SubPhase2Step1Interaction3 />} />
          <Route path="/phase5/subphase/2/step/1/score" element={<Phase5SubPhase2Step1ScoreCalculation />} />

          {/* Phase 5 SubPhase 2 Step 1 Remedial Routes */}
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/2/step/1/remedial/a2/task/a" element={<Phase5SubPhase2Step1RemedialA2TaskA />} />
          <Route path="/phase5/subphase/2/step/1/remedial/a2/task/b" element={<Phase5SubPhase2Step1RemedialA2TaskB />} />
          <Route path="/phase5/subphase/2/step/1/remedial/a2/task/c" element={<Phase5SubPhase2Step1RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/2/step/1/remedial/b1/task/a" element={<Phase5SubPhase2Step1RemedialB1TaskA />} />
          <Route path="/phase5/subphase/2/step/1/remedial/b1/task/b" element={<Phase5SubPhase2Step1RemedialB1TaskB />} />
          <Route path="/phase5/subphase/2/step/1/remedial/b1/task/c" element={<Phase5SubPhase2Step1RemedialB1TaskC />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/2/step/1/remedial/b2/task/a" element={<Phase5SubPhase2Step1RemedialB2TaskA />} />
          <Route path="/phase5/subphase/2/step/1/remedial/b2/task/b" element={<Phase5SubPhase2Step1RemedialB2TaskB />} />
          <Route path="/phase5/subphase/2/step/1/remedial/b2/task/c" element={<Phase5SubPhase2Step1RemedialB2TaskC />} />
          <Route path="/phase5/subphase/2/step/1/remedial/b2/task/d" element={<Phase5SubPhase2Step1RemedialB2TaskD />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/2/step/1/remedial/c1/task/a" element={<Phase5SubPhase2Step1RemedialC1TaskA />} />
          <Route path="/phase5/subphase/2/step/1/remedial/c1/task/b" element={<Phase5SubPhase2Step1RemedialC1TaskB />} />
          <Route path="/phase5/subphase/2/step/1/remedial/c1/task/c" element={<Phase5SubPhase2Step1RemedialC1TaskC />} />
          <Route path="/phase5/subphase/2/step/1/remedial/c1/task/d" element={<Phase5SubPhase2Step1RemedialC1TaskD />} />

          {/* Phase 5 SubPhase 2 Step 2 Routes */}
          <Route path="/phase5/subphase/2/step/2" element={<Phase5SubPhase2Step2Intro />} />
          <Route path="/phase5/subphase/2/step/2/interaction/1" element={<Phase5SubPhase2Step2Interaction1 />} />
          <Route path="/phase5/subphase/2/step/2/interaction/2" element={<Phase5SubPhase2Step2Interaction2 />} />
          <Route path="/phase5/subphase/2/step/2/interaction/3" element={<Phase5SubPhase2Step2Interaction3 />} />
          <Route path="/phase5/subphase/2/step/2/score" element={<Phase5SubPhase2Step2ScoreCalculation />} />

          {/* Phase 5 SubPhase 2 Step 2 Remedial Routes */}
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/2/step/2/remedial/a2/task/a" element={<Phase5SubPhase2Step2RemedialA2TaskA />} />
          <Route path="/phase5/subphase/2/step/2/remedial/a2/task/b" element={<Phase5SubPhase2Step2RemedialA2TaskB />} />
          <Route path="/phase5/subphase/2/step/2/remedial/a2/task/c" element={<Phase5SubPhase2Step2RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/2/step/2/remedial/b1/task/a" element={<Phase5SubPhase2Step2RemedialB1TaskA />} />
          <Route path="/phase5/subphase/2/step/2/remedial/b1/task/b" element={<Phase5SubPhase2Step2RemedialB1TaskB />} />
          <Route path="/phase5/subphase/2/step/2/remedial/b1/task/c" element={<Phase5SubPhase2Step2RemedialB1TaskC />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/2/step/2/remedial/b2/task/a" element={<Phase5SubPhase2Step2RemedialB2TaskA />} />
          <Route path="/phase5/subphase/2/step/2/remedial/b2/task/b" element={<Phase5SubPhase2Step2RemedialB2TaskB />} />
          <Route path="/phase5/subphase/2/step/2/remedial/b2/task/c" element={<Phase5SubPhase2Step2RemedialB2TaskC />} />
          <Route path="/phase5/subphase/2/step/2/remedial/b2/task/d" element={<Phase5SubPhase2Step2RemedialB2TaskD />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/2/step/2/remedial/c1/task/a" element={<Phase5SubPhase2Step2RemedialC1TaskA />} />
          <Route path="/phase5/subphase/2/step/2/remedial/c1/task/b" element={<Phase5SubPhase2Step2RemedialC1TaskB />} />
          <Route path="/phase5/subphase/2/step/2/remedial/c1/task/c" element={<Phase5SubPhase2Step2RemedialC1TaskC />} />
          <Route path="/phase5/subphase/2/step/2/remedial/c1/task/d" element={<Phase5SubPhase2Step2RemedialC1TaskD />} />

          {/* Phase 5 SubPhase 2 Step 3 Routes */}
          <Route path="/phase5/subphase/2/step/3" element={<Phase5SubPhase2Step3Intro />} />
          <Route path="/phase5/subphase/2/step/3/interaction/1" element={<Phase5SubPhase2Step3Interaction1 />} />
          <Route path="/phase5/subphase/2/step/3/interaction/2" element={<Phase5SubPhase2Step3Interaction2 />} />
          <Route path="/phase5/subphase/2/step/3/interaction/3" element={<Phase5SubPhase2Step3Interaction3 />} />
          <Route path="/phase5/subphase/2/step/3/score" element={<Phase5SubPhase2Step3ScoreCalculation />} />
          {/* Phase 5 SubPhase 2 Step 3 Remedial Routes */}
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/2/step/3/remedial/a2/task/a" element={<Phase5SubPhase2Step3RemedialA2TaskA />} />
          <Route path="/phase5/subphase/2/step/3/remedial/a2/task/b" element={<Phase5SubPhase2Step3RemedialA2TaskB />} />
          <Route path="/phase5/subphase/2/step/3/remedial/a2/task/c" element={<Phase5SubPhase2Step3RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/2/step/3/remedial/b1/task/a" element={<Phase5SubPhase2Step3RemedialB1TaskA />} />
          <Route path="/phase5/subphase/2/step/3/remedial/b1/task/b" element={<Phase5SubPhase2Step3RemedialB1TaskB />} />
          <Route path="/phase5/subphase/2/step/3/remedial/b1/task/c" element={<Phase5SubPhase2Step3RemedialB1TaskC />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/2/step/3/remedial/b2/task/a" element={<Phase5SubPhase2Step3RemedialB2TaskA />} />
          <Route path="/phase5/subphase/2/step/3/remedial/b2/task/b" element={<Phase5SubPhase2Step3RemedialB2TaskB />} />
          <Route path="/phase5/subphase/2/step/3/remedial/b2/task/c" element={<Phase5SubPhase2Step3RemedialB2TaskC />} />
          <Route path="/phase5/subphase/2/step/3/remedial/b2/task/d" element={<Phase5SubPhase2Step3RemedialB2TaskD />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/2/step/3/remedial/c1/task/a" element={<Phase5SubPhase2Step3RemedialC1TaskA />} />
          <Route path="/phase5/subphase/2/step/3/remedial/c1/task/b" element={<Phase5SubPhase2Step3RemedialC1TaskB />} />
          <Route path="/phase5/subphase/2/step/3/remedial/c1/task/c" element={<Phase5SubPhase2Step3RemedialC1TaskC />} />
          <Route path="/phase5/subphase/2/step/3/remedial/c1/task/d" element={<Phase5SubPhase2Step3RemedialC1TaskD />} />

          {/* Phase 5 SubPhase 2 Step 4 Routes */}
          <Route path="/phase5/subphase/2/step/4" element={<Phase5SubPhase2Step4Intro />} />
          <Route path="/phase5/subphase/2/step/4/interaction/1" element={<Phase5SubPhase2Step4Interaction1 />} />
          <Route path="/phase5/subphase/2/step/4/interaction/2" element={<Phase5SubPhase2Step4Interaction2 />} />
          <Route path="/phase5/subphase/2/step/4/interaction/3" element={<Phase5SubPhase2Step4Interaction3 />} />
          <Route path="/phase5/subphase/2/step/4/score" element={<Phase5SubPhase2Step4ScoreCalculation />} />
          {/* Phase 5 SubPhase 2 Step 4 Remedial Routes */}
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/2/step/4/remedial/a2/task/a" element={<Phase5SubPhase2Step4RemedialA2TaskA />} />
          <Route path="/phase5/subphase/2/step/4/remedial/a2/task/b" element={<Phase5SubPhase2Step4RemedialA2TaskB />} />
          <Route path="/phase5/subphase/2/step/4/remedial/a2/task/c" element={<Phase5SubPhase2Step4RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/2/step/4/remedial/b1/task/a" element={<Phase5SubPhase2Step4RemedialB1TaskA />} />
          <Route path="/phase5/subphase/2/step/4/remedial/b1/task/b" element={<Phase5SubPhase2Step4RemedialB1TaskB />} />
          <Route path="/phase5/subphase/2/step/4/remedial/b1/task/c" element={<Phase5SubPhase2Step4RemedialB1TaskC />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/2/step/4/remedial/b2/task/a" element={<Phase5SubPhase2Step4RemedialB2TaskA />} />
          <Route path="/phase5/subphase/2/step/4/remedial/b2/task/b" element={<Phase5SubPhase2Step4RemedialB2TaskB />} />
          <Route path="/phase5/subphase/2/step/4/remedial/b2/task/c" element={<Phase5SubPhase2Step4RemedialB2TaskC />} />
          <Route path="/phase5/subphase/2/step/4/remedial/b2/task/d" element={<Phase5SubPhase2Step4RemedialB2TaskD />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/2/step/4/remedial/c1/task/a" element={<Phase5SubPhase2Step4RemedialC1TaskA />} />
          <Route path="/phase5/subphase/2/step/4/remedial/c1/task/b" element={<Phase5SubPhase2Step4RemedialC1TaskB />} />
          <Route path="/phase5/subphase/2/step/4/remedial/c1/task/c" element={<Phase5SubPhase2Step4RemedialC1TaskC />} />
          <Route path="/phase5/subphase/2/step/4/remedial/c1/task/d" element={<Phase5SubPhase2Step4RemedialC1TaskD />} />

          {/* Phase 5 SubPhase 2 Step 5 Routes */}
          <Route path="/phase5/subphase/2/step/5" element={<Phase5SubPhase2Step5Intro />} />
          <Route path="/phase5/subphase/2/step/5/interaction/1" element={<Phase5SubPhase2Step5Interaction1 />} />
          <Route path="/phase5/subphase/2/step/5/interaction/2" element={<Phase5SubPhase2Step5Interaction2 />} />
          <Route path="/phase5/subphase/2/step/5/interaction/3" element={<Phase5SubPhase2Step5Interaction3 />} />
          <Route path="/phase5/subphase/2/step/5/score" element={<Phase5SubPhase2Step5ScoreCalculation />} />
          {/* Phase 5 SubPhase 2 Step 5 Remedial Routes */}
          {/* A2 Remedial */}
          <Route path="/phase5/subphase/2/step/5/remedial/a2/task/a" element={<Phase5SubPhase2Step5RemedialA2TaskA />} />
          <Route path="/phase5/subphase/2/step/5/remedial/a2/task/b" element={<Phase5SubPhase2Step5RemedialA2TaskB />} />
          <Route path="/phase5/subphase/2/step/5/remedial/a2/task/c" element={<Phase5SubPhase2Step5RemedialA2TaskC />} />
          {/* B1 Remedial */}
          <Route path="/phase5/subphase/2/step/5/remedial/b1/task/a" element={<Phase5SubPhase2Step5RemedialB1TaskA />} />
          <Route path="/phase5/subphase/2/step/5/remedial/b1/task/b" element={<Phase5SubPhase2Step5RemedialB1TaskB />} />
          <Route path="/phase5/subphase/2/step/5/remedial/b1/task/c" element={<Phase5SubPhase2Step5RemedialB1TaskC />} />
          {/* B2 Remedial */}
          <Route path="/phase5/subphase/2/step/5/remedial/b2/task/a" element={<Phase5SubPhase2Step5RemedialB2TaskA />} />
          <Route path="/phase5/subphase/2/step/5/remedial/b2/task/b" element={<Phase5SubPhase2Step5RemedialB2TaskB />} />
          <Route path="/phase5/subphase/2/step/5/remedial/b2/task/c" element={<Phase5SubPhase2Step5RemedialB2TaskC />} />
          <Route path="/phase5/subphase/2/step/5/remedial/b2/task/d" element={<Phase5SubPhase2Step5RemedialB2TaskD />} />
          {/* C1 Remedial */}
          <Route path="/phase5/subphase/2/step/5/remedial/c1/task/a" element={<Phase5SubPhase2Step5RemedialC1TaskA />} />
          <Route path="/phase5/subphase/2/step/5/remedial/c1/task/b" element={<Phase5SubPhase2Step5RemedialC1TaskB />} />
          <Route path="/phase5/subphase/2/step/5/remedial/c1/task/c" element={<Phase5SubPhase2Step5RemedialC1TaskC />} />
          <Route path="/phase5/subphase/2/step/5/remedial/c1/task/d" element={<Phase5SubPhase2Step5RemedialC1TaskD />} />


{/* Phase 6 Complete */}
          <Route path="/phase6/complete" element={<Phase6Complete />} />

          {/* Phase 6 SubPhase 1 */}
          <Route path="/phase6/subphase/1/step/1" element={<P6SP1S1Intro />} />
          <Route path="/phase6/subphase/1/step/1/interaction/1" element={<P6SP1S1Int1 />} />
          <Route path="/phase6/subphase/1/step/1/interaction/2" element={<P6SP1S1Int2 />} />
          <Route path="/phase6/subphase/1/step/1/interaction/3" element={<P6SP1S1Int3 />} />
          <Route path="/phase6/subphase/1/step/1/score" element={<P6SP1S1Score />} />
          <Route path="/phase6/subphase/1/step/1/remedial/a2/task/a" element={<P6SP1S1RemA2TaskA />} />
          <Route path="/phase6/subphase/1/step/1/remedial/a2/task/b" element={<P6SP1S1RemA2TaskB />} />
          <Route path="/phase6/subphase/1/step/1/remedial/a2/task/c" element={<P6SP1S1RemA2TaskC />} />
          <Route path="/phase6/subphase/1/step/1/remedial/b1/task/a" element={<P6SP1S1RemB1TaskA />} />
          <Route path="/phase6/subphase/1/step/1/remedial/b1/task/b" element={<P6SP1S1RemB1TaskB />} />
          <Route path="/phase6/subphase/1/step/1/remedial/b1/task/c" element={<P6SP1S1RemB1TaskC />} />
          <Route path="/phase6/subphase/1/step/1/remedial/b2/task/a" element={<P6SP1S1RemB2TaskA />} />
          <Route path="/phase6/subphase/1/step/1/remedial/b2/task/b" element={<P6SP1S1RemB2TaskB />} />
          <Route path="/phase6/subphase/1/step/1/remedial/b2/task/c" element={<P6SP1S1RemB2TaskC />} />
          <Route path="/phase6/subphase/1/step/1/remedial/b2/task/d" element={<P6SP1S1RemB2TaskD />} />
          <Route path="/phase6/subphase/1/step/1/remedial/c1/task/a" element={<P6SP1S1RemC1TaskA />} />
          <Route path="/phase6/subphase/1/step/1/remedial/c1/task/b" element={<P6SP1S1RemC1TaskB />} />
          <Route path="/phase6/subphase/1/step/1/remedial/c1/task/c" element={<P6SP1S1RemC1TaskC />} />
          <Route path="/phase6/subphase/1/step/1/remedial/c1/task/d" element={<P6SP1S1RemC1TaskD />} />

          <Route path="/phase6/subphase/1/step/2" element={<P6SP1S2Intro />} />
          <Route path="/phase6/subphase/1/step/2/interaction/1" element={<P6SP1S2Int1 />} />
          <Route path="/phase6/subphase/1/step/2/interaction/2" element={<P6SP1S2Int2 />} />
          <Route path="/phase6/subphase/1/step/2/interaction/3" element={<P6SP1S2Int3 />} />
          <Route path="/phase6/subphase/1/step/2/score" element={<P6SP1S2Score />} />
          <Route path="/phase6/subphase/1/step/2/remedial/a2/task/a" element={<P6SP1S2RemA2TaskA />} />
          <Route path="/phase6/subphase/1/step/2/remedial/a2/task/b" element={<P6SP1S2RemA2TaskB />} />
          <Route path="/phase6/subphase/1/step/2/remedial/a2/task/c" element={<P6SP1S2RemA2TaskC />} />
          <Route path="/phase6/subphase/1/step/2/remedial/b1/task/a" element={<P6SP1S2RemB1TaskA />} />
          <Route path="/phase6/subphase/1/step/2/remedial/b1/task/b" element={<P6SP1S2RemB1TaskB />} />
          <Route path="/phase6/subphase/1/step/2/remedial/b1/task/c" element={<P6SP1S2RemB1TaskC />} />
          <Route path="/phase6/subphase/1/step/2/remedial/b2/task/a" element={<P6SP1S2RemB2TaskA />} />
          <Route path="/phase6/subphase/1/step/2/remedial/b2/task/b" element={<P6SP1S2RemB2TaskB />} />
          <Route path="/phase6/subphase/1/step/2/remedial/b2/task/c" element={<P6SP1S2RemB2TaskC />} />
          <Route path="/phase6/subphase/1/step/2/remedial/b2/task/d" element={<P6SP1S2RemB2TaskD />} />
          <Route path="/phase6/subphase/1/step/2/remedial/c1/task/a" element={<P6SP1S2RemC1TaskA />} />
          <Route path="/phase6/subphase/1/step/2/remedial/c1/task/b" element={<P6SP1S2RemC1TaskB />} />
          <Route path="/phase6/subphase/1/step/2/remedial/c1/task/c" element={<P6SP1S2RemC1TaskC />} />

          <Route path="/phase6/subphase/1/step/3" element={<P6SP1S3Intro />} />
          <Route path="/phase6/subphase/1/step/3/interaction/1" element={<P6SP1S3Int1 />} />
          <Route path="/phase6/subphase/1/step/3/interaction/2" element={<P6SP1S3Int2 />} />
          <Route path="/phase6/subphase/1/step/3/interaction/3" element={<P6SP1S3Int3 />} />
          <Route path="/phase6/subphase/1/step/3/score" element={<P6SP1S3Score />} />
          <Route path="/phase6/subphase/1/step/3/remedial/a2/task/a" element={<P6SP1S3RemA2TaskA />} />
          <Route path="/phase6/subphase/1/step/3/remedial/a2/task/b" element={<P6SP1S3RemA2TaskB />} />
          <Route path="/phase6/subphase/1/step/3/remedial/a2/task/c" element={<P6SP1S3RemA2TaskC />} />
          <Route path="/phase6/subphase/1/step/3/remedial/b1/task/a" element={<P6SP1S3RemB1TaskA />} />
          <Route path="/phase6/subphase/1/step/3/remedial/b1/task/b" element={<P6SP1S3RemB1TaskB />} />
          <Route path="/phase6/subphase/1/step/3/remedial/b1/task/c" element={<P6SP1S3RemB1TaskC />} />
          <Route path="/phase6/subphase/1/step/3/remedial/b2/task/a" element={<P6SP1S3RemB2TaskA />} />
          <Route path="/phase6/subphase/1/step/3/remedial/b2/task/b" element={<P6SP1S3RemB2TaskB />} />
          <Route path="/phase6/subphase/1/step/3/remedial/b2/task/c" element={<P6SP1S3RemB2TaskC />} />
          <Route path="/phase6/subphase/1/step/3/remedial/b2/task/d" element={<P6SP1S3RemB2TaskD />} />
          <Route path="/phase6/subphase/1/step/3/remedial/c1/task/a" element={<P6SP1S3RemC1TaskA />} />
          <Route path="/phase6/subphase/1/step/3/remedial/c1/task/b" element={<P6SP1S3RemC1TaskB />} />
          <Route path="/phase6/subphase/1/step/3/remedial/c1/task/c" element={<P6SP1S3RemC1TaskC />} />
          <Route path="/phase6/subphase/1/step/3/remedial/c1/task/d" element={<P6SP1S3RemC1TaskD />} />

          <Route path="/phase6/subphase/1/step/4" element={<P6SP1S4Intro />} />
          <Route path="/phase6/subphase/1/step/4/interaction/1" element={<P6SP1S4Int1 />} />
          <Route path="/phase6/subphase/1/step/4/interaction/2" element={<P6SP1S4Int2 />} />
          <Route path="/phase6/subphase/1/step/4/interaction/3" element={<P6SP1S4Int3 />} />
          <Route path="/phase6/subphase/1/step/4/score" element={<P6SP1S4Score />} />
          <Route path="/phase6/subphase/1/step/4/remedial/a2/task/a" element={<P6SP1S4RemA2TaskA />} />
          <Route path="/phase6/subphase/1/step/4/remedial/a2/task/b" element={<P6SP1S4RemA2TaskB />} />
          <Route path="/phase6/subphase/1/step/4/remedial/a2/task/c" element={<P6SP1S4RemA2TaskC />} />
          <Route path="/phase6/subphase/1/step/4/remedial/b1/task/a" element={<P6SP1S4RemB1TaskA />} />
          <Route path="/phase6/subphase/1/step/4/remedial/b1/task/b" element={<P6SP1S4RemB1TaskB />} />
          <Route path="/phase6/subphase/1/step/4/remedial/b1/task/c" element={<P6SP1S4RemB1TaskC />} />
          <Route path="/phase6/subphase/1/step/4/remedial/b2/task/a" element={<P6SP1S4RemB2TaskA />} />
          <Route path="/phase6/subphase/1/step/4/remedial/b2/task/b" element={<P6SP1S4RemB2TaskB />} />
          <Route path="/phase6/subphase/1/step/4/remedial/b2/task/c" element={<P6SP1S4RemB2TaskC />} />
          <Route path="/phase6/subphase/1/step/4/remedial/b2/task/d" element={<P6SP1S4RemB2TaskD />} />
          <Route path="/phase6/subphase/1/step/4/remedial/c1/task/a" element={<P6SP1S4RemC1TaskA />} />
          <Route path="/phase6/subphase/1/step/4/remedial/c1/task/b" element={<P6SP1S4RemC1TaskB />} />
          <Route path="/phase6/subphase/1/step/4/remedial/c1/task/c" element={<P6SP1S4RemC1TaskC />} />
          <Route path="/phase6/subphase/1/step/4/remedial/c1/task/d" element={<P6SP1S4RemC1TaskD />} />

          <Route path="/phase6/subphase/1/step/5" element={<P6SP1S5Intro />} />
          <Route path="/phase6/subphase/1/step/5/interaction/1" element={<P6SP1S5Int1 />} />
          <Route path="/phase6/subphase/1/step/5/interaction/2" element={<P6SP1S5Int2 />} />
          <Route path="/phase6/subphase/1/step/5/interaction/3" element={<P6SP1S5Int3 />} />
          <Route path="/phase6/subphase/1/step/5/score" element={<P6SP1S5Score />} />
          <Route path="/phase6/subphase/1/step/5/remedial/a2/task/a" element={<P6SP1S5RemA2TaskA />} />
          <Route path="/phase6/subphase/1/step/5/remedial/a2/task/b" element={<P6SP1S5RemA2TaskB />} />
          <Route path="/phase6/subphase/1/step/5/remedial/a2/task/c" element={<P6SP1S5RemA2TaskC />} />
          <Route path="/phase6/subphase/1/step/5/remedial/b1/task/a" element={<P6SP1S5RemB1TaskA />} />
          <Route path="/phase6/subphase/1/step/5/remedial/b1/task/b" element={<P6SP1S5RemB1TaskB />} />
          <Route path="/phase6/subphase/1/step/5/remedial/b1/task/c" element={<P6SP1S5RemB1TaskC />} />
          <Route path="/phase6/subphase/1/step/5/remedial/b2/task/a" element={<P6SP1S5RemB2TaskA />} />
          <Route path="/phase6/subphase/1/step/5/remedial/b2/task/b" element={<P6SP1S5RemB2TaskB />} />
          <Route path="/phase6/subphase/1/step/5/remedial/b2/task/c" element={<P6SP1S5RemB2TaskC />} />
          <Route path="/phase6/subphase/1/step/5/remedial/c1/task/a" element={<P6SP1S5RemC1TaskA />} />
          <Route path="/phase6/subphase/1/step/5/remedial/c1/task/b" element={<P6SP1S5RemC1TaskB />} />
          <Route path="/phase6/subphase/1/step/5/remedial/c1/task/c" element={<P6SP1S5RemC1TaskC />} />
          <Route path="/phase6/subphase/1/step/5/remedial/c1/task/d" element={<P6SP1S5RemC1TaskD />} />

          {/* Phase 6 SubPhase 2 */}
          <Route path="/phase6/subphase/2/step/1" element={<P6SP2S1Intro />} />
          <Route path="/phase6/subphase/2/step/1/interaction/1" element={<P6SP2S1Int1 />} />
          <Route path="/phase6/subphase/2/step/1/interaction/2" element={<P6SP2S1Int2 />} />
          <Route path="/phase6/subphase/2/step/1/interaction/3" element={<P6SP2S1Int3 />} />
          <Route path="/phase6/subphase/2/step/1/score" element={<P6SP2S1Score />} />
          <Route path="/phase6/subphase/2/step/1/remedial/a2/task/a" element={<P6SP2S1RemA2TaskA />} />
          <Route path="/phase6/subphase/2/step/1/remedial/a2/task/b" element={<P6SP2S1RemA2TaskB />} />
          <Route path="/phase6/subphase/2/step/1/remedial/a2/task/c" element={<P6SP2S1RemA2TaskC />} />
          <Route path="/phase6/subphase/2/step/1/remedial/b1/task/a" element={<P6SP2S1RemB1TaskA />} />
          <Route path="/phase6/subphase/2/step/1/remedial/b1/task/b" element={<P6SP2S1RemB1TaskB />} />
          <Route path="/phase6/subphase/2/step/1/remedial/b1/task/c" element={<P6SP2S1RemB1TaskC />} />
          <Route path="/phase6/subphase/2/step/1/remedial/b2/task/a" element={<P6SP2S1RemB2TaskA />} />
          <Route path="/phase6/subphase/2/step/1/remedial/b2/task/b" element={<P6SP2S1RemB2TaskB />} />
          <Route path="/phase6/subphase/2/step/1/remedial/b2/task/c" element={<P6SP2S1RemB2TaskC />} />
          <Route path="/phase6/subphase/2/step/1/remedial/b2/task/d" element={<P6SP2S1RemB2TaskD />} />
          <Route path="/phase6/subphase/2/step/1/remedial/c1/task/a" element={<P6SP2S1RemC1TaskA />} />
          <Route path="/phase6/subphase/2/step/1/remedial/c1/task/b" element={<P6SP2S1RemC1TaskB />} />
          <Route path="/phase6/subphase/2/step/1/remedial/c1/task/c" element={<P6SP2S1RemC1TaskC />} />

          <Route path="/phase6/subphase/2/step/2" element={<P6SP2S2Intro />} />
          <Route path="/phase6/subphase/2/step/2/interaction/1" element={<P6SP2S2Int1 />} />
          <Route path="/phase6/subphase/2/step/2/interaction/2" element={<P6SP2S2Int2 />} />
          <Route path="/phase6/subphase/2/step/2/interaction/3" element={<P6SP2S2Int3 />} />
          <Route path="/phase6/subphase/2/step/2/score" element={<P6SP2S2Score />} />
          <Route path="/phase6/subphase/2/step/2/remedial/a2/task/a" element={<P6SP2S2RemA2TaskA />} />
          <Route path="/phase6/subphase/2/step/2/remedial/a2/task/b" element={<P6SP2S2RemA2TaskB />} />
          <Route path="/phase6/subphase/2/step/2/remedial/a2/task/c" element={<P6SP2S2RemA2TaskC />} />
          <Route path="/phase6/subphase/2/step/2/remedial/b1/task/a" element={<P6SP2S2RemB1TaskA />} />
          <Route path="/phase6/subphase/2/step/2/remedial/b1/task/b" element={<P6SP2S2RemB1TaskB />} />
          <Route path="/phase6/subphase/2/step/2/remedial/b1/task/c" element={<P6SP2S2RemB1TaskC />} />
          <Route path="/phase6/subphase/2/step/2/remedial/b2/task/a" element={<P6SP2S2RemB2TaskA />} />
          <Route path="/phase6/subphase/2/step/2/remedial/b2/task/b" element={<P6SP2S2RemB2TaskB />} />
          <Route path="/phase6/subphase/2/step/2/remedial/b2/task/c" element={<P6SP2S2RemB2TaskC />} />
          <Route path="/phase6/subphase/2/step/2/remedial/b2/task/d" element={<P6SP2S2RemB2TaskD />} />
          <Route path="/phase6/subphase/2/step/2/remedial/c1/task/a" element={<P6SP2S2RemC1TaskA />} />
          <Route path="/phase6/subphase/2/step/2/remedial/c1/task/b" element={<P6SP2S2RemC1TaskB />} />
          <Route path="/phase6/subphase/2/step/2/remedial/c1/task/c" element={<P6SP2S2RemC1TaskC />} />

          <Route path="/phase6/subphase/2/step/3" element={<P6SP2S3Intro />} />
          <Route path="/phase6/subphase/2/step/3/interaction/1" element={<P6SP2S3Int1 />} />
          <Route path="/phase6/subphase/2/step/3/interaction/2" element={<P6SP2S3Int2 />} />
          <Route path="/phase6/subphase/2/step/3/interaction/3" element={<P6SP2S3Int3 />} />
          <Route path="/phase6/subphase/2/step/3/score" element={<P6SP2S3Score />} />
          <Route path="/phase6/subphase/2/step/3/remedial/a2/task/a" element={<P6SP2S3RemA2TaskA />} />
          <Route path="/phase6/subphase/2/step/3/remedial/a2/task/b" element={<P6SP2S3RemA2TaskB />} />
          <Route path="/phase6/subphase/2/step/3/remedial/a2/task/c" element={<P6SP2S3RemA2TaskC />} />
          <Route path="/phase6/subphase/2/step/3/remedial/b1/task/a" element={<P6SP2S3RemB1TaskA />} />
          <Route path="/phase6/subphase/2/step/3/remedial/b1/task/b" element={<P6SP2S3RemB1TaskB />} />
          <Route path="/phase6/subphase/2/step/3/remedial/b1/task/c" element={<P6SP2S3RemB1TaskC />} />
          <Route path="/phase6/subphase/2/step/3/remedial/b2/task/a" element={<P6SP2S3RemB2TaskA />} />
          <Route path="/phase6/subphase/2/step/3/remedial/b2/task/b" element={<P6SP2S3RemB2TaskB />} />
          <Route path="/phase6/subphase/2/step/3/remedial/b2/task/c" element={<P6SP2S3RemB2TaskC />} />
          <Route path="/phase6/subphase/2/step/3/remedial/b2/task/d" element={<P6SP2S3RemB2TaskD />} />
          <Route path="/phase6/subphase/2/step/3/remedial/c1/task/a" element={<P6SP2S3RemC1TaskA />} />
          <Route path="/phase6/subphase/2/step/3/remedial/c1/task/b" element={<P6SP2S3RemC1TaskB />} />
          <Route path="/phase6/subphase/2/step/3/remedial/c1/task/c" element={<P6SP2S3RemC1TaskC />} />
          <Route path="/phase6/subphase/2/step/3/remedial/c1/task/d" element={<P6SP2S3RemC1TaskD />} />

          <Route path="/phase6/subphase/2/step/4" element={<P6SP2S4Intro />} />
          <Route path="/phase6/subphase/2/step/4/interaction/1" element={<P6SP2S4Int1 />} />
          <Route path="/phase6/subphase/2/step/4/interaction/2" element={<P6SP2S4Int2 />} />
          <Route path="/phase6/subphase/2/step/4/interaction/3" element={<P6SP2S4Int3 />} />
          <Route path="/phase6/subphase/2/step/4/score" element={<P6SP2S4Score />} />
          <Route path="/phase6/subphase/2/step/4/remedial/a2/task/a" element={<P6SP2S4RemA2TaskA />} />
          <Route path="/phase6/subphase/2/step/4/remedial/a2/task/b" element={<P6SP2S4RemA2TaskB />} />
          <Route path="/phase6/subphase/2/step/4/remedial/a2/task/c" element={<P6SP2S4RemA2TaskC />} />
          <Route path="/phase6/subphase/2/step/4/remedial/b1/task/a" element={<P6SP2S4RemB1TaskA />} />
          <Route path="/phase6/subphase/2/step/4/remedial/b1/task/b" element={<P6SP2S4RemB1TaskB />} />
          <Route path="/phase6/subphase/2/step/4/remedial/b1/task/c" element={<P6SP2S4RemB1TaskC />} />
          <Route path="/phase6/subphase/2/step/4/remedial/b2/task/a" element={<P6SP2S4RemB2TaskA />} />
          <Route path="/phase6/subphase/2/step/4/remedial/b2/task/b" element={<P6SP2S4RemB2TaskB />} />
          <Route path="/phase6/subphase/2/step/4/remedial/b2/task/c" element={<P6SP2S4RemB2TaskC />} />
          <Route path="/phase6/subphase/2/step/4/remedial/b2/task/d" element={<P6SP2S4RemB2TaskD />} />
          <Route path="/phase6/subphase/2/step/4/remedial/c1/task/a" element={<P6SP2S4RemC1TaskA />} />
          <Route path="/phase6/subphase/2/step/4/remedial/c1/task/b" element={<P6SP2S4RemC1TaskB />} />
          <Route path="/phase6/subphase/2/step/4/remedial/c1/task/c" element={<P6SP2S4RemC1TaskC />} />
          <Route path="/phase6/subphase/2/step/4/remedial/c1/task/d" element={<P6SP2S4RemC1TaskD />} />

          <Route path="/phase6/subphase/2/step/5" element={<P6SP2S5Intro />} />
          <Route path="/phase6/subphase/2/step/5/interaction/1" element={<P6SP2S5Int1 />} />
          <Route path="/phase6/subphase/2/step/5/interaction/2" element={<P6SP2S5Int2 />} />
          <Route path="/phase6/subphase/2/step/5/interaction/3" element={<P6SP2S5Int3 />} />
          <Route path="/phase6/subphase/2/step/5/score" element={<P6SP2S5Score />} />
          <Route path="/phase6/subphase/2/step/5/remedial/a2/task/a" element={<P6SP2S5RemA2TaskA />} />
          <Route path="/phase6/subphase/2/step/5/remedial/a2/task/b" element={<P6SP2S5RemA2TaskB />} />
          <Route path="/phase6/subphase/2/step/5/remedial/a2/task/c" element={<P6SP2S5RemA2TaskC />} />
          <Route path="/phase6/subphase/2/step/5/remedial/b1/task/a" element={<P6SP2S5RemB1TaskA />} />
          <Route path="/phase6/subphase/2/step/5/remedial/b1/task/b" element={<P6SP2S5RemB1TaskB />} />
          <Route path="/phase6/subphase/2/step/5/remedial/b1/task/c" element={<P6SP2S5RemB1TaskC />} />
          <Route path="/phase6/subphase/2/step/5/remedial/b2/task/a" element={<P6SP2S5RemB2TaskA />} />
          <Route path="/phase6/subphase/2/step/5/remedial/b2/task/b" element={<P6SP2S5RemB2TaskB />} />
          <Route path="/phase6/subphase/2/step/5/remedial/b2/task/c" element={<P6SP2S5RemB2TaskC />} />
          <Route path="/phase6/subphase/2/step/5/remedial/c1/task/a" element={<P6SP2S5RemC1TaskA />} />
          <Route path="/phase6/subphase/2/step/5/remedial/c1/task/b" element={<P6SP2S5RemC1TaskB />} />
          <Route path="/phase6/subphase/2/step/5/remedial/c1/task/c" element={<P6SP2S5RemC1TaskC />} />
          <Route path="/phase6/subphase/2/step/5/remedial/c1/task/d" element={<P6SP2S5RemC1TaskD />} />

          {/* Profile Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/profile/delete-account" element={<DeleteAccount />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/users" element={<AdminUserList />} />
          <Route path="/admin/users/:userId" element={<AdminUserViewer />} />
          <Route path="/admin/chat" element={<AdminChat />} />
          <Route path="/admin/chat/:userId" element={<AdminChat />} />
          <Route path="/chat" element={<StudentChat />} />

          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
    </ApiProvider>
    </ErrorBoundary>
  )
}

export default App
