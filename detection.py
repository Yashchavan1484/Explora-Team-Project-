from ultralytics import YOLO
import cv2

class HumanCounter:
    def __init__(self, model_name="yolov8n.pt"):
        """
        Initializes the YOLOv8 model for human detection.
        :param model_name: Name of the YOLOv8 model variant.
        """
        self.model = YOLO(model_name)

    def count_humans(self, image_path):
        """
        Counts the number of humans in a given image.
        :param image_path: Path to the input image.
        :return: Integer count of detected humans.
        """
        image = cv2.imread(image_path)
        if image is None:
            raise FileNotFoundError(f"Image not found: {image_path}")

        results = self.model(image)
        count = 0

        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                if r.names[cls] == "person":
                    count += 1

        return count
