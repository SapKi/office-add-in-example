/// <reference path="../../chakra-ui-react.d.ts" />
import React, { useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import { SettingsPage } from "../../emailService";
import SearchPage from "./SearchPage";

/**
 * Root app: tabs for Task 1 (Users) and Task 2 (Search).
 */
const App = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box minH="100vh" bg="gray.50">
      <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Users</Tab>
          <Tab>Search</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <SettingsPage />
          </TabPanel>
          <TabPanel px={0}>
            <SearchPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default App;
