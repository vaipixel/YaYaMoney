class RecordEditor {
    async applyChanges(record) {
        this.showLoading();
        await updateRecord();
        this.dismissAdjustMoneyDialog();
        this.dismissTransferDialog();
    }

    async deleteRecord(recordId) {
        this.showLoading();
        await deleteRecord(this.data.editingRecord._id);
        this.dismissAdjustMoneyDialog();
        this.dismissTransferDialog();
        this.hideDeleteRecordConfirmDialog();
        this.hideLoading();
        this.requestAccountDetail(this.data._accountId);
    }
}

module.exports = RecordEditor;