import mongoose from "mongoose";

const filterSchema = mongoose.Schema(
  {
    brands: [
      {
        name: {
          type: String,
          required: true
        },
        value: {
          type: String,
          required: true
        },
        isChecked: {
          type: Boolean,
          default: false,
          required: true
        }
      }
    ],
    categories: [
      {
        name: {
          type: String,
          required: true
        },
        value: {
          type: String,
          required: true
        },
        isChecked: {
          type: Boolean,
          default: false,
          required: true
        }
      }
    ]
  }
)

const Filter = mongoose.model("Filter", filterSchema);
export default Filter;
