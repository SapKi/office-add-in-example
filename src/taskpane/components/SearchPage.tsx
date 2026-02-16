/// <reference path="../../chakra-ui-react.d.ts" />
import React, { useCallback, useState, useEffect } from "react";
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
import { keyframes } from "@emotion/react";
import { searchWordDocument, isWordAvailable, insertSampleContent } from "../wordSearch";

// Beautiful animations using Emotion keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6), 0 0 0 0 rgba(6, 182, 212, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0), 0 0 0 12px rgba(6, 182, 212, 0);
  }
`;

const bounceUpDown = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
`;

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
  const [mounted, setMounted] = useState(false);
  const [sampleButtonClicked, setSampleButtonClicked] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Trigger animations on mount
    setMounted(true);
  }, []);

  const handleInsertSample = useCallback(async () => {
    // Mark button as clicked to stop bouncing animation
    setSampleButtonClicked(true);
    
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
        description: "Search for \"Employee\", \"Employer\", \"Contract\", or \"termination\" to test.",
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
    <Box
      p={6}
      w="100%"
      h="100%"
      minH="100%"
      sx={{
        animation: mounted ? `${fadeIn} 0.6s ease-out` : "none",
      }}
    >
      <VStack align="stretch" spacing={4}>
        <Heading
          size="md"
          bgGradient="linear(to-r, purple.600, blue.600, cyan.600)"
          bgClip="text"
          fontWeight="bold"
          sx={{
            animation: mounted ? `${fadeInUp} 0.8s ease-out 0.1s both` : "none",
            opacity: mounted ? 1 : 0,
          }}
        >
          Document Search
        </Heading>
        <Text
          fontSize="sm"
          color="purple.700"
          fontWeight="medium"
          sx={{
            animation: mounted ? `${fadeInUp} 0.8s ease-out 0.2s both` : "none",
            opacity: mounted ? 1 : 0,
          }}
        >
          Search the current Word document. Top 3 results are shown below.
        </Text>

        <Box
          sx={{
            animation: mounted ? `${slideInRight} 0.7s ease-out 0.3s both` : "none",
            opacity: mounted ? 1 : 0,
          }}
        >
          <Button
            size="sm"
            bgGradient="linear(to-r, purple.400, pink.400)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, purple.500, pink.500)",
              transform: "translateY(-2px)",
              boxShadow: "xl",
              transition: "all 0.2s",
            }}
            _active={{
              bgGradient: "linear(to-r, purple.600, pink.600)",
            }}
            onClick={handleInsertSample}
            isLoading={inserting}
            loadingText="Inserting..."
            isDisabled={!wordAvailable}
            transition="all 0.2s"
            fontWeight="semibold"
            sx={{
              animation: !sampleButtonClicked && mounted && wordAvailable
                ? `${bounceUpDown} 1.5s ease-in-out infinite 1s`
                : "none",
            }}
          >
            Insert Sample Text
          </Button>
        </Box>

        <Box
          sx={{
            animation: mounted ? `${scaleIn} 0.7s ease-out 0.4s both` : "none",
            opacity: mounted ? 1 : 0,
          }}
        >
          <Input
            placeholder="Enter search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            size="md"
            bg="white"
            borderColor="purple.300"
            focusBorderColor="purple.500"
            _focus={{
              boxShadow: "0 0 0 3px rgba(147, 51, 234, 0.2)",
              borderColor: "purple.500",
            }}
            _hover={{ borderColor: "purple.400" }}
            transition="all 0.2s"
          />
        </Box>

        <Box
          sx={{
            animation: mounted ? `${fadeIn} 0.6s ease-out 0.5s both` : "none",
            opacity: mounted ? 1 : 0,
          }}
        >
          <Checkbox
            isChecked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            colorScheme="gray"
            transition="all 0.2s"
          >
            <Text as="span" fontWeight="medium">
              Case sensitive
            </Text>
          </Checkbox>
        </Box>

        <Box
          sx={{
            animation: mounted ? `${scaleIn} 0.8s ease-out 0.6s both` : "none",
            opacity: mounted ? 1 : 0,
          }}
        >
          <Button
            bgGradient="linear(to-r, blue.500, cyan.500, teal.500)"
            color="white"
            onClick={handleSearch}
            isLoading={loading}
            loadingText="Searching..."
            size="lg"
            fontWeight="bold"
            _hover={{
              bgGradient: "linear(to-r, blue.600, cyan.600, teal.600)",
              transform: "translateY(-2px)",
              boxShadow: "xl",
              transition: "all 0.2s",
            }}
            _active={{
              bgGradient: "linear(to-r, blue.700, cyan.700, teal.700)",
              transform: "translateY(0)",
            }}
            transition="all 0.2s"
            sx={{
              animation: mounted
                ? `${scaleIn} 0.8s ease-out 0.6s both, ${pulseGlow} 2s ease-in-out 1s infinite`
                : "none",
            }}
          >
            🔍 Search
          </Button>
        </Box>

        {!wordAvailable && (
          <Box
            p={3}
            bgGradient="linear(to-r, orange.100, yellow.100)"
            borderRadius="md"
            borderWidth="2px"
            borderColor="orange.300"
          >
            <Text fontSize="sm" color="orange.700" fontWeight="medium">
              ⚠️ Run this add-in inside Word to search the document.
            </Text>
          </Box>
        )}

        {results.length > 0 && (
          <Box
            mt={4}
            w="100%"
            sx={{
              animation: `${fadeInUp} 0.6s ease-out`,
            }}
          >
            <Heading
              size="sm"
              mb={3}
              bgGradient="linear(to-r, green.600, emerald.600)"
              bgClip="text"
              fontWeight="bold"
            >
              ✨ Top 3 results
            </Heading>
            <VStack align="stretch" spacing={3}>
              {results.map((text, index) => {
                const colors = [
                  { bg: "purple.50", border: "purple.300", hoverBg: "purple.100" },
                  { bg: "blue.50", border: "blue.300", hoverBg: "blue.100" },
                  { bg: "cyan.50", border: "cyan.300", hoverBg: "cyan.100" },
                ];
                const colorScheme = colors[index] || colors[0];
                return (
                  <Box
                    key={index}
                    p={4}
                    bg={colorScheme.bg}
                    borderRadius="lg"
                    borderWidth="2px"
                    borderColor={colorScheme.border}
                    sx={{
                      animation: `${fadeInUp} 0.5s ease-out ${index * 0.1}s both`,
                    }}
                    _hover={{
                      bg: colorScheme.hoverBg,
                      borderColor: colorScheme.border,
                      transform: "translateX(6px) scale(1.02)",
                      boxShadow: "md",
                      transition: "all 0.2s",
                    }}
                    transition="all 0.2s"
                  >
                    <Text fontSize="sm" color="gray.700" fontWeight="medium" noOfLines={3}>
                      {text || "(empty)"}
                    </Text>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default SearchPage;
