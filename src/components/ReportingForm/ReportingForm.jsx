import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  MapPin,
  Send,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import styles from "./ReportingForm.module.css";
import getLocation from "../../utils/fetchLocation";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector } from "react-redux";

const ReportingForm = () => {
  const userDetails = useSelector((state) => state.user.userInfo);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.filePreview));
    };
  }, [files]);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };
  async function fetch() {
    try {
      const locationData = await getLocation();
      setLocation(locationData);
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        toast({
          title: "Location access denied.",
          description:
            "Please enable location services in your browser settings.",
        });
      } else {
        toast({
          title: "Failed to fetch location",
          description: "Please try again or enter the location manually.",
        });
      }
    }
  }
  const handleFileChange = (e) => {
    const allFiles = Array.from(e.target.files);
    const validFiles = [];
    allFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `File ${file.name} exceeds the size limit of 5MB. Try Uploading Again.`,
        });
      } else {
        validFiles.push({
          fileObj: file,
          fileName: file.name,
          fileType: file.type,
          filePreview: URL.createObjectURL(file),
        });
      }
    });

    setFiles(validFiles);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (category == "" || description == "" || files.length == 0) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all the required fields.",
      });
      setIsSubmitting(false);
      return;
    }
    if (location.latitude == null || location.longitude == null) {
      toast({
        title: "Location not found",
        description: "Please fetch or manually enter your location.",
      });
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);

    try {
      const uploadedImageUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file.fileObj);
          formData.append("upload_preset", "SafeSpeak");
          formData.append("cloud_name", "dfylu3ufc");

          const uploadOptions = {
            url: file.fileType.startsWith("video")
              ? "https://api.cloudinary.com/v1_1/dfylu3ufc/video/upload"
              : "https://api.cloudinary.com/v1_1/dfylu3ufc/image/upload",
            method: "POST",
            data: formData,
          };

          const cloudRes = await axios(uploadOptions);
          return cloudRes.data.secure_url;
        })
      );
      const url = `${
        import.meta.env.VITE_SERVER_URL
      }/api/location/reportAnonymous`;

      const response = await axios.post(url, {
        filesArray: uploadedImageUrls,
        latitude: location.latitude,
        longitude: location.longitude,
        description, // Include the description in the request
        category,
        recaptchaToken,
        userInfo: userDetails ? userDetails : null,
      });

      toast({
        description: response.data.Message,
      });
      setFiles([]);
      setDescription(""); // Clear the description after submission
      setCategory("");
    } catch (err) {
      toast({
        title: "Error submitting report",
        description: err.response?.data?.Message || "An error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          Anonymous Report Submission
        </h1>
        <p className="text-xl text-blue-600">
          Your voice matters. Help us make a difference.
        </p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl">
            <ShieldAlert className="mr-2 h-6 w-6 text-blue-500" />
            Submit Your Report
          </CardTitle>
          <CardDescription>
            All submissions are completely anonymous and secure.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    required
                    value={category}
                    onValueChange={(value) => setCategory(value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crime">Crime</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    placeholder="Please describe the issue in detail"
                    required
                    value={description}
                    className="min-h-[150px]"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2 h-5 w-5 text-blue-400" />
                      <Input
                        required
                        id="location"
                        placeholder="Enter the location of the incident"
                        className="pl-10"
                        value={
                          location.latitude && location.longitude
                            ? `Latitude: ${location.latitude}, Longitude: ${location.longitude}`
                            : "No Location Info"
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fetch()}
                    >
                      Fetch Location
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident-files">Upload Image/File</Label>
                  <div className="relative">
                    <input
                      type="file"
                      id="incident-files"
                      accept="image/*,video/*"
                      capture="environment"
                      onChange={handleFileChange}
                      required
                      multiple
                    />
                  </div>
                  {files.length > 0 && (
                    <div className={styles.filepreviews}>
                      {files.map((file, index) =>
                        file.fileType.startsWith("image") ? (
                          <img
                            key={index}
                            src={file.filePreview}
                            alt={file.fileName}
                            className={styles.filepreview}
                          />
                        ) : file.fileType.startsWith("video") ? (
                          <video
                            key={index}
                            src={file.filePreview}
                            controls
                            className={styles.filepreview}
                          />
                        ) : null
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-4 justify-center flex">
                  <ReCAPTCHA
                    sitekey="6LfSs2sqAAAAAEfVKTZH5tEVESh3V-7dRbjditaN"
                    onChange={handleRecaptchaChange}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            {step < 2 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Report <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ReportingForm;
