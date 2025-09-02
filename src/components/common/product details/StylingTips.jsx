import { Instagram } from "lucide-react";
import BackgroundImage from "../../../assets/images/Product_Details/SF_670x370.jpg";

function StylingTips() {
    const tips = [
        {
            title: "Traditional Occasions",
            description:
                "Pair with traditional jewelry and a matching blouse for weddings and formal events.",
        },
        {
            title: "Contemporary Look",
            description:
                "Style with a designer blouse and minimal accessories for a modern interpretation.",
        },
        {
            title: "Festive Ensemble",
            description:
                "Add statement jewelry and embellished footwear for festive celebrations.",
        },
    ];

    return (
        <div className="bg-white rounded-lg overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Styling Tips
                    </h2>
                    <div className="space-y-4">
                        {tips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-foreground text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">
                                        {tip.title}
                                    </h3>
                                    <p className="text-foreground">
                                        {tip.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className="p-6 lg:p-8 flex items-center   
                    rounded-sm overflow-hidden
                    justify-center  relative  bg-[url('./assets/images/Product_Details/SF_670x370.jpg')] bg-cover bg-no-repeat"
                >
                    {/* <img src={BackgroundImage} className="absolute z-0" /> */}
                    <div className="text-center z-10 text-white">
                        <Instagram className="w-10 h-10  mx-auto mb-3" />
                        <h3 className="text-xl font-bold  mb-2">
                            Share Your Style
                        </h3>
                        <p
                            className="text-white mb-4"
                        >
                            Tag us on Instagram with #YourBrandStyle to be
                            featured on our page
                        </p>
                        
                        <a href="https://www.instagram.com/srijanfabs/" className=" text-foreground px-6 py-2 rounded-lg font-medium  transition-colors bg-white border border-transparent hover:bg-transparent hover:border-white hover:text-white">
                            Follow Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StylingTips;
