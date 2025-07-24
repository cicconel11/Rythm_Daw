import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface RegisterBioProps {
  onCreateAccount: (bio: string) => void;
}

export function RegisterBio({ onCreateAccount }: RegisterBioProps) {
  const [bio, setBio] = useState("");
  const maxLength = 140;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAccount(bio);
  };

  return (
    <div className="min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={100} className="h-2" />
            <p className="text-sm text-gray-400 mt-2">Step 2 of 2</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl font-['JetBrains_Mono']">
              R
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-white font-['Inter']">
            Tell us about yourself
          </CardTitle>
          <p className="text-gray-400">Write a short bio for your profile</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bio" className="text-gray-300">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, maxLength))}
                className="bg-[#0D1126] border-gray-600 text-white min-h-[100px]"
                placeholder="Producer from Los Angeles. Love creating ambient and techno tracks..."
              />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-sm ${bio.length > maxLength * 0.9 ? "text-orange-400" : "text-gray-500"}`}
                >
                  {bio.length}/{maxLength}
                </span>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#7E4FFF] hover:bg-[#6B3FE6] text-white font-semibold"
            >
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
