/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MyAnimals from './components/MyAnimals';
import Wildlife from './components/Wildlife';
import Rescue from './components/Rescue';
import Profile from './components/Profile';
import DemoTour from './components/DemoTour';

export default function App() {
  const [isDemoActive, setIsDemoActive] = useState(false);

  return (
    <HashRouter>
      {isDemoActive && <DemoTour onFinish={() => setIsDemoActive(false)} />}
      <Routes>
        <Route path="/" element={<Layout onLaunchDemo={() => setIsDemoActive(true)} />}>
          <Route index element={<MyAnimals />} />
          <Route path="wildlife" element={<Wildlife />} />
          <Route path="rescue" element={<Rescue />} />
          <Route path="profile" element={<Profile onLaunchDemo={() => setIsDemoActive(true)} />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
