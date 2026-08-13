import React, { useState } from "react";
import { X, Search, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductWithAI } from "../../store/slices/productSlice";
import { toggleAIModal } from "../../store/slices/popupSlice";

const AISearchModal = () => {
  const [userPrompt, setUserPrompt] = useState("");

  const dispatch = useDispatch();

  const { aiSearching } = useSelector(
    (state) => state.product
  );

  const { isAIPopupOpen } = useSelector(
    (state) => state.popup
  );

  const exampleText = [
    "Find the best suitable GPU with Ryzen 5600x",
    "Find all leather jackets for men",
    "Find all red T-shirts for me",
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    if (!userPrompt.trim()) return;

    dispatch(fetchProductWithAI(userPrompt));
  };

  if (!isAIPopupOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => dispatch(toggleAIModal())}
    >
      <div
        className="bg-background/95 backdrop-blur-md border border-border rounded-2xl p-8 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <h2 className="text-2xl font-bold">
              AI Product Search
            </h2>
          </div>

          <button
            onClick={() => dispatch(toggleAIModal())}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          Describe what you're looking for and AI will find
          the most suitable products.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="space-y-6"
        >
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Example: Gaming headphones under $100 with good bass"
              value={userPrompt}
              onChange={(e) =>
                setUserPrompt(e.target.value)
              }
              className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              aiSearching || !userPrompt.trim()
            }
            className={`w-full py-4 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 to-blue-500 transition-opacity ${
              aiSearching
                ? "opacity-70 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            {aiSearching ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  AI is searching products...
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Search With AI</span>
              </div>
            )}
          </button>
        </form>

        {/* Examples */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-3">
            Try these examples:
          </p>

          <div className="flex flex-wrap gap-2">
            {exampleText.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() =>
                  setUserPrompt(example)
                }
                className="px-3 py-2 text-sm rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearchModal;