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
import {
  searchWordDocument,
  isWordAvailable,
  insertSampleContent,
  selectAndHighlightResult,
  clearAllHighlights,
  highlightAllSearchMatches,
  type SearchResultItem,
} from "../wordSearch";

const CONTEXT_WORDS_BEFORE = 2;
const CONTEXT_WORDS_AFTER = 2;

/**
 * Finds the start index of the nth occurrence of matchText in text (case-insensitive).
 * occurrenceIndex is 0-based.
 */
function findNthMatchIndex(text: string, matchText: string, occurrenceIndex: number): number {
  if (!matchText.trim() || occurrenceIndex < 0) return -1;
  const lower = text.toLowerCase();
  const matchLower = matchText.toLowerCase();
  let idx = 0;
  for (let n = 0; n <= occurrenceIndex; n++) {
    const pos = lower.indexOf(matchLower, idx);
    if (pos === -1) return -1;
    if (n === occurrenceIndex) return pos;
    idx = pos + matchText.length;
  }
  return -1;
}

/**
 * Returns 2 words before + match + 2 words after from the paragraph for context.
 * occurrenceIndexInParagraph: when the same paragraph has multiple matches, pass 0 for first, 1 for second, etc.
 * All text is taken from the document as-is (no capitalization or trimming of case).
 */
function getContextSnippet(
  paragraphText: string,
  matchText: string,
  occurrenceIndexInParagraph: number = 0
): { before: string; match: string; after: string } {
  if (!matchText.trim()) return { before: paragraphText, match: "", after: "" };
  const text = paragraphText || "";
  const idx = findNthMatchIndex(text, matchText, occurrenceIndexInParagraph);
  if (idx === -1) return { before: text, match: matchText, after: "" };
  const endIdx = idx + matchText.length;
  const beforeRaw = text.slice(0, idx).trim();
  const afterRaw = text.slice(endIdx).trim();
  const wordsBefore = beforeRaw.split(/\s+/).filter(Boolean).slice(-CONTEXT_WORDS_BEFORE);
  const wordsAfter = afterRaw.split(/\s+/).filter(Boolean).slice(0, CONTEXT_WORDS_AFTER);
  const before = wordsBefore.join(" ");
  const match = text.slice(idx, endIdx);
  const after = wordsAfter.join(" ");
  return { before, match, after };
}

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
const RESULTS_PAGE_SIZE = 3;
const MAX_SEARCH_RESULTS = 10;

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [allResults, setAllResults] = useState<SearchResultItem[]>([]);
  const [displayStart, setDisplayStart] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sampleButtonClicked, setSampleButtonClicked] = useState(false);
  const toast = useToast();

  const results = allResults.slice(displayStart, displayStart + RESULTS_PAGE_SIZE);
  const hasNext = allResults.length > RESULTS_PAGE_SIZE && displayStart < allResults.length - RESULTS_PAGE_SIZE;

  useEffect(() => {
    // Trigger animations on mount
    setMounted(true);
  }, []);

  // Search as you type (debounced). Does not block typing: no loading state, longer debounce.
  useEffect(() => {
    if (!query.trim()) {
      setAllResults([]);
      setDisplayStart(0);
      if (isWordAvailable()) {
        clearAllHighlights().catch(() => {});
      }
      return () => {};
    }
    if (!isWordAvailable()) {
      setAllResults([]);
      setDisplayStart(0);
      return () => {};
    }
    const timer = setTimeout(() => {
      clearAllHighlights()
        .then(() =>
          searchWordDocument(query, {
            matchCase: caseSensitive,
            matchWholeWordFirst: true,
          }, MAX_SEARCH_RESULTS)
        )
        .then((items) => {
          setAllResults(items);
          setDisplayStart(0);
        })
        .catch((err) => {
          console.error("Search error:", err);
          setAllResults([]);
          setDisplayStart(0);
          toast({
            title: "Search failed",
            description: err instanceof Error ? err.message : "Unknown error",
            status: "error",
            duration: 4000,
          });
        });
    }, 550);
    return () => clearTimeout(timer);
  }, [query, caseSensitive, toast]);

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
        description: "Try searching for \"Employee\", \"salary\", \"confidentiality\", \"termination\", or \"schedule\".",
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
      setAllResults([]);
      setDisplayStart(0);
      return;
    }
    setLoading(true);
    try {
      await clearAllHighlights();
      const items = await searchWordDocument(query, {
        matchCase: caseSensitive,
        matchWholeWordFirst: true,
      }, MAX_SEARCH_RESULTS);
      setAllResults(items);
      setDisplayStart(0);
      const count = await highlightAllSearchMatches(query, {
        matchCase: caseSensitive,
        matchWholeWordFirst: true,
      });
      if (count === 0) {
        toast({ title: "No matches found", status: "info", duration: 2000 });
      } else {
        toast({
          title: "Matches highlighted",
          description: `${count} match${count === 1 ? "" : "es"} highlighted in the document.`,
          status: "success",
          duration: 3000,
        });
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

  const handleResultClick = useCallback(
    async (visibleIndex: number) => {
      if (!query.trim() || !isWordAvailable()) return;
      const globalIndex = displayStart + visibleIndex;
      try {
        await clearAllHighlights();
        await selectAndHighlightResult(query, {
          matchCase: caseSensitive,
          matchWholeWordFirst: true,
        }, globalIndex);
      } catch (err) {
        toast({
          title: "Could not highlight",
          description: err instanceof Error ? err.message : "Unknown error",
          status: "error",
          duration: 3000,
        });
      }
    },
    [query, caseSensitive, displayStart, toast]
  );

  const handleNextResults = useCallback(() => {
    setDisplayStart((prev) =>
      Math.min(prev + 1, Math.max(0, allResults.length - RESULTS_PAGE_SIZE))
    );
  }, [allResults.length]);

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
          Perform search in the document; Top 3 results appear when typing. Click a result to highlight it in the document.
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
          w="100%"
          sx={{
            animation: mounted ? `${scaleIn} 0.7s ease-out 0.4s both` : "none",
            opacity: mounted ? 1 : 0,
          }}
        >
          <VStack align="stretch" spacing={0} w="100%">
            <Input
              placeholder="Enter search query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              size="md"
              bg="white"
              borderColor="purple.300"
              focusBorderColor="purple.500"
              autoComplete="off"
              sx={{ textTransform: "none" }}
              _focus={{
                boxShadow: "0 0 0 3px rgba(147, 51, 234, 0.2)",
                borderColor: "purple.500",
              }}
              _hover={{ borderColor: "purple.400" }}
              transition="all 0.2s"
            />
            {results.length > 0 && (
              <Box
                w="100%"
                mt={2}
                mb={0}
                bg="white"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
                boxShadow="sm"
                maxH="200px"
                overflowY="auto"
                as="ul"
                listStyleType="none"
                p={0}
                m={0}
              >
                {results.map((item, index) => {
                  const globalIndex = displayStart + index;
                  const occurrenceInParagraph = allResults
                    .slice(0, globalIndex)
                    .filter((r) => r.paragraphText === item.paragraphText).length;
                  const { before, match, after } = getContextSnippet(
                    item.paragraphText,
                    item.matchText,
                    occurrenceInParagraph
                  );
                  return (
                    <Box
                      key={globalIndex}
                      as="li"
                      px={3}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: "gray.50" }}
                      transition="background 0.15s"
                      onClick={() => handleResultClick(index)}
                      borderBottomWidth={index < results.length - 1 ? 1 : 0}
                      borderColor="gray.100"
                    >
                      <Text
                        fontSize="sm"
                        color="gray.700"
                        noOfLines={2}
                        sx={{ textTransform: "none" }}
                      >
                        {before && <Text as="span">{before} </Text>}
                        <Text as="span" bg="yellow.200" fontWeight="bold" px={0.5}>
                          {match}
                        </Text>
                        {after && <Text as="span"> {after}</Text>}
                      </Text>
                    </Box>
                  );
                })}
              </Box>
            )}
            {results.length > 0 && hasNext && (
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                mt={2}
                onClick={handleNextResults}
                w="100%"
              >
                Next results →
              </Button>
            )}
          </VStack>
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
      </VStack>
    </Box>
  );
};

export default SearchPage;
