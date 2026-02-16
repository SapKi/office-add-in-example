/// <reference path="../../chakra-ui-react.d.ts" />
import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Heading,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { searchWordDocument, isWordAvailable, insertSampleContent } from "../wordSearch";

/**
 * Task 2: Word search interface.
 * - Text input for search query
 * - Checkbox: Case sensitive on/off
 * - Top 3 search results displayed in the add-in
 */
const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inserting, setInserting] = useState(false);
  const toast = useToast();

  const handleInsertSample = useCallback(async () => {
    if (!isWordAvailable()) {
      toast({
        title: "Open in Word",
        description: "Insert sample text only works when the add-in is running inside Word.",
        status: "info",
        duration: 4000,
      });
      return;
    }
    setInserting(true);
    try {
      await insertSampleContent();
      toast({
        title: "Sample text inserted",
        description: "Search for \"document\", \"search\", \"sample\", or \"Word\" to test.",
        status: "success",
        duration: 4000,
      });
    } catch (err) {
      toast({
        title: "Insert failed",
        description: err instanceof Error ? err.message : "Unknown error",
        status: "error",
        duration: 4000,
      });
    } finally {
      setInserting(false);
    }
  }, [toast]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      toast({ title: "Enter a search term", status: "warning", duration: 2000 });
      return;
    }
    if (!isWordAvailable()) {
      toast({
        title: "Open in Word",
        description: "Search works when the add-in is running inside Word.",
        status: "info",
        duration: 4000,
      });
      setResults([]);
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const top3 = await searchWordDocument(query, { matchCase: caseSensitive });
      setResults(top3);
      if (top3.length === 0) {
        toast({ title: "No matches found", status: "info", duration: 2000 });
      }
    } catch (err) {
      toast({
        title: "Search failed",
        description: err instanceof Error ? err.message : "Unknown error",
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, [query, caseSensitive, toast]);

  const wordAvailable = isWordAvailable();

  return (
    <Box p={6} maxW="md">
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Document Search</Heading>
        <Text fontSize="sm" color="gray.600">
          Search the current Word document. Top 3 results are shown below.
        </Text>

        <Button
          size="sm"
          variant="outline"
          colorScheme="gray"
          onClick={handleInsertSample}
          isLoading={inserting}
          loadingText="Inserting..."
          isDisabled={!wordAvailable}
        >
          Insert sample text to test search
        </Button>

        <Input
          placeholder="Enter search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          size="md"
        />

        <Checkbox
          isChecked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
        >
          Case sensitive
        </Checkbox>

        <Button
          colorScheme="blue"
          onClick={handleSearch}
          isLoading={loading}
          loadingText="Searching..."
        >
          Search
        </Button>

        {!wordAvailable && (
          <Text fontSize="sm" color="orange.600">
            Run this add-in inside Word to search the document.
          </Text>
        )}

        {results.length > 0 && (
          <Box mt={4} w="100%">
            <Heading size="sm" mb={2}>
              Top 3 results
            </Heading>
            <VStack align="stretch" spacing={2}>
              {results.map((text, index) => (
                <Box
                  key={index}
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="sm" noOfLines={3}>
                    {text || "(empty)"}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default SearchPage;
