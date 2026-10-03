"use client";

import { useCallback, useRef, useState } from "react";
import { Stack, TextInput, Card, Text, Button, Spinner } from "@sanity/ui";
import { set, unset } from "sanity";
import type { ObjectInputProps } from "sanity";

interface AddressValue {
  fullAddress?: string;
  street?: string;
  city?: string;
  postcode?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    postcode?: string;
    country?: string;
  };
}

function extractAddressComponents(result: NominatimResult) {
  const addr = result.address || {};
  const street = [addr.house_number, addr.road].filter(Boolean).join(" ");
  const city = addr.city || addr.town || addr.village || "";
  return {
    street,
    city,
    postcode: addr.postcode || "",
    country: addr.country || "",
  };
}

export function AddressInput(props: ObjectInputProps) {
  const { value, onChange } = props;
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchAddress = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Free, no API key. Respect Nominatim's usage policy:
      // https://operations.osmfoundation.org/policies/nominatim/
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5`,
      );
      const data: NominatimResult[] = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error("Error fetching address:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value;
      setQuery(newQuery);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      // 500ms+ debounce is important here — Nominatim's free tier is
      // rate-limited to ~1 request/sec.
      debounceRef.current = setTimeout(() => {
        searchAddress(newQuery);
      }, 500);
    },
    [searchAddress],
  );

  const handleSelect = useCallback(
    (result: NominatimResult) => {
      const components = extractAddressComponents(result);

      onChange(
        set({
          fullAddress: result.display_name,
          ...components,
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        }),
      );

      setQuery(result.display_name);
      setSuggestions([]);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange(unset());
    setQuery("");
    setSuggestions([]);
  }, [onChange]);

  const currentAddress = value as AddressValue | undefined;

  return (
    <Stack space={3}>
      <TextInput
        value={query || currentAddress?.fullAddress || ""}
        onChange={handleInputChange}
        placeholder="Start typing an address..."
      />

      {isLoading && (
        <Stack space={2}>
          <Spinner muted />
          <Text size={1} muted>
            Searching...
          </Text>
        </Stack>
      )}

      {suggestions.length > 0 && (
        <Card padding={2} radius={2} shadow={1}>
          <Stack space={2}>
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.place_id}
                mode="ghost"
                onClick={() => handleSelect(suggestion)}
                style={{ textAlign: "left", width: "100%" }}
              >
                <Text size={1}>{suggestion.display_name}</Text>
              </Button>
            ))}
          </Stack>
        </Card>
      )}

      {currentAddress?.fullAddress && (
        <Stack space={2}>
          <Card padding={3} radius={2} tone="positive">
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Selected Address:
              </Text>
              <Text size={1}>{currentAddress.fullAddress}</Text>
              {currentAddress.city && (
                <Text size={1} muted>
                  City: {currentAddress.city}
                </Text>
              )}
              {currentAddress.postcode && (
                <Text size={1} muted>
                  Postcode: {currentAddress.postcode}
                </Text>
              )}
              {currentAddress.lat && currentAddress.lng && (
                <Text size={1} muted>
                  Coordinates: {currentAddress.lat.toFixed(4)},{" "}
                  {currentAddress.lng.toFixed(4)}
                </Text>
              )}
            </Stack>
          </Card>
          <Button mode="ghost" tone="critical" onClick={handleClear}>
            Clear Address
          </Button>
        </Stack>
      )}
    </Stack>
  );
}