import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import SocialButtons from "./SocialButtons";
import { generateGuestIdentity } from "../utils/guestIdentity";
import { getCountry } from "../utils/geolocation";

export default function Onboarding({ onComplete = () => {} }) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [preferredGender, setPreferredGender] = useState("");
  const [country, setCountry] = useState("");
  const [guestIdentity, setGuestIdentity] = useState({ name: "", avatarEmoji: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const detectedCountry = await getCountry();
      setCountry(detectedCountry || "");

      const identity = generateGuestIdentity(); 
      // ensure consistent fields
      setGuestIdentity({
        name: identity?.name || "",
        avatarEmoji: identity?.avatar || identity?.avatarEmoji || "🙂"
      });

      setLoading(false);
    };
    init();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!age || !gender) return;

    const onboardingData = {
      id: crypto.randomUUID(),
      age: parseInt(age, 10),
      gender,
      preferredGender: preferredGender || "Any",
      country,
      guestName: guestIdentity.name,
      avatarEmoji: guestIdentity.avatarEmoji,
      createdAt: new Date().toISOString()
    };

    console.log("Onboarding complete:", onboardingData);

    // DO NOT write to localStorage here anymore.
    // useGuest.startAsGuest() will handle that.

    onComplete(onboardingData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Welcome to AuraPal</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* AGE */}
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="13"
                max="120"
                required
              />
            </div>

            {/* GENDER */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <Select
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
                value={gender}
                onChange={setGender}
              />
            </div>

            {/* PREFERRED GENDER */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Preferred Gender to Chat With
              </label>
              <Select
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Any", label: "Any" },
                ]}
                value={preferredGender}
                onChange={setPreferredGender}
              />
            </div>

            {/* COUNTRY */}
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input value={country} readOnly />
            </div>

            {/* GUEST NAME + AVATAR */}
            <div>
              <label className="block text-sm font-medium mb-1">Your Guest Name</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{guestIdentity.avatarEmoji}</span>
                <Input value={guestIdentity.name} readOnly />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You can change this after signing in.
              </p>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="space-y-2">
              <SocialButtons guestIdentity={guestIdentity} />
            </div>

            {/* DONATION LINKS */}
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-xs text-gray-500">Support AuraPal</p>
              <div className="flex gap-2">
                <a
                  href="https://paypal.me/AnkitD538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border hover:bg-white hover:bg-opacity-5 transition-colors"
                  style={{
                    color: "var(--text)",
                    borderColor: "var(--brand-start)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  PayPal
                </a>

                <a
                  href="https://cash.app/$AuraAnky"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border hover:bg-white hover:bg-opacity-5 transition-colors"
                  style={{
                    color: "var(--text)",
                    borderColor: "var(--brand-end)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  Cash App
                </a>
              </div>
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-400"
            >
              Start Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
