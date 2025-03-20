import GenerateBackgrounds from "./generate-backgrounds";
import GenerateSymbols from "./generate-symbols";
import GenerateUI from "./generate-ui";

export default function AssetsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Sweet Bonanza Asset Generators</h1>

      <div className="mb-10">
        <GenerateBackgrounds />
      </div>

      <hr className="border-gray-300 my-8" />

      <div className="mb-10">
        <GenerateSymbols />
      </div>

      <hr className="border-gray-300 my-8" />

      <div>
        <GenerateUI />
      </div>
    </div>
  );
}
